/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Spiffcode, Inc. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

'use strict';

import nls = require('vs/nls');
import {TPromise} from 'vs/base/common/winjs.base';
import {Action} from 'vs/base/common/actions';
import {IQuickOpenService, IPickOpenEntry, IPickOptions} from 'vs/workbench/services/quickopen/common/quickOpenService';
import {Registry} from 'vs/platform/platform';
import {SyncActionDescriptor} from 'vs/platform/actions/common/actions';
import {IWorkbenchActionRegistry, Extensions as ActionExtensions} from 'vs/workbench/common/actionRegistry';
import {IGithubService, openRepository} from 'githubService';
import {RepositoryInfo, TagInfo, Error} from 'github';
import {IMessageService, IMessageWithAction, Severity} from 'vs/platform/message/common/message';

export class AboutGHCodeAction extends Action {

	public static ID = 'workbench.action.ghcode.welcome';
    public static LABEL = 'About GHCode';

	constructor(
		actionId: string,
		actionLabel: string,
        @IGithubService private githubService: IGithubService,
		@IMessageService private messageService: IMessageService
	) {
		super(actionId, actionLabel);
	}

	public run(): TPromise<any> {
        // TODO: Show better about UI
        let s: string[] = [];
        if (this.githubService.isAuthenticated() && this.githubService.isTag) {
            s.push('Note: GHCode is in read only mode because you are viewing a tag.');
        }
        s.push('Welcome to GHCode, brought to you by Spiffcode, Inc.');
        this.messageService.show(Severity.Info, s);
        return TPromise.as(true);
    }
}

export class ChooseRepositoryAction extends Action {

	public static ID = 'workbench.action.github.chooseRepository';
	public static LABEL = 'Choose Repository';

	constructor(
		actionId: string,
		actionLabel: string,
		@IQuickOpenService private quickOpenService: IQuickOpenService,
        @IGithubService private githubService: IGithubService
	) {
		super(actionId, actionLabel);
	}

	public run(): TPromise<any> {
        let choices = new TPromise<string[]>((c, e) => {
            // By default this api sorts by 'updated', which results in unexpected sort orders.
            // Instead sort by last push time.
            this.githubService.github.getUser().repos({sort: 'pushed', per_page: 1000 }, (err: Error, repos: RepositoryInfo[]) => {
                if (err) {
                    e('Error contacting service.');
                } else {
                    // Put the current repo at the top
                    let choices = repos.map(repo => repo.full_name).filter(name => name !== this.githubService.repoName);
                    if (this.githubService.repoName)
                        choices.splice(0, 0, this.githubService.repoName);
                    c(choices);
                }
            });
        });

        let options: IPickOptions = {
            placeHolder: nls.localize('chooseRepository', 'Choose Repository'),
            autoFocus: { autoFocusFirstEntry: true }
        };

        return this.quickOpenService.pick(choices, options).then((result) => {
            if (result && result !== this.githubService.repoName) {
                openRepository(result);
            }
        });
    }
}

export class ChooseReferenceAction extends Action {

	public static ID = 'workbench.action.github.chooseReference';
	public static LABEL = 'Choose Branch or Tag';

	constructor(
		actionId: string,
		actionLabel: string,
		@IQuickOpenService private quickOpenService: IQuickOpenService,
        @IGithubService private githubService: IGithubService
	) {
		super(actionId, actionLabel);
	}

	public run(): TPromise<any> {        
        let repo = this.githubService.github.getRepo(this.githubService.repoName);

        // Get branches as IPickOpenEntry[]        
        let branches = new TPromise<IPickOpenEntry[]>((c, e) => {
            repo.listBranches((err: Error, results: string[]) => {
                if (err) {
                    e('Error contacting service.');
                } else {
                    let items = results;
                    if (!this.githubService.isTag) {
                        items = results.filter(branch => branch !== this.githubService.ref);
                        items.splice(0, 0, this.githubService.ref);
                    }
                    let choices: IPickOpenEntry[] = items.map(item => { return { id: 'branch', label: item, description: nls.localize('gitBranch', 'branch') } });
                    c(choices);
                }
            });
        });

        // Get tags as IPickOpenEntry[]
        let tags = new TPromise<IPickOpenEntry[]>((c, e) => {
            repo.listTags((err: Error, tags?: TagInfo[]) => {
                if (err) {
                    e('Error contacting service.');
                } else { 
                    let items = tags.map(tag => tag.name);
                    if (this.githubService.isTag) {
                        items = items.filter(name => name !== this.githubService.ref);
                        items.splice(0, 0, this.githubService.ref);
                    }
                    let choices: IPickOpenEntry[] = items.map(item => { return { id: 'tag', label: item, description: nls.localize('gitTag', 'tag') } });
                    c(choices);
                }
            });
        });

        // Wrap these in a promise that returns a single array
        let promise = new TPromise<IPickOpenEntry[]>((c, e) => {
            // Execute the tag and branch promises at once
            TPromise.join([branches, tags]).then((results: IPickOpenEntry[][]) => {
                // The order of the results is unknown. Figure that out.
                let indexBranches = -1;
                for (let i = 0; i < 2; i++) {
                    // Find out which index is branches, which is tags
                    if (indexBranches < 0) {                    
                        if (results[i].length > 0) {
                            if (results[i][0].id === 'branch') {
                                indexBranches = i;
                            }
                        }
                    }
                }

                let indexOrderFirst = !this.githubService.isTag ? indexBranches : indexBranches ^ 1;
                let choices: IPickOpenEntry[] = results[indexOrderFirst].concat(results[indexOrderFirst ^ 1]);
                c(choices);
            }, (err: any) => {
                e(err);
            });
        });

        let options: IPickOptions = {
            placeHolder: nls.localize('chooseBranchOrTag', 'Choose Branch or Tag'),
            autoFocus: { autoFocusFirstEntry: true }
        };

        return this.quickOpenService.pick(promise, options).then((result) => {
            if (result && result.label !== this.githubService.ref) {
                openRepository(this.githubService.repoName, result.label, result.id === 'tag');
            }
        });
    }
}

// Register these actions
let registry = <IWorkbenchActionRegistry>Registry.as(ActionExtensions.WorkbenchActions);
registry.registerWorkbenchAction(new SyncActionDescriptor(AboutGHCodeAction, AboutGHCodeAction.ID, null), null);
registry.registerWorkbenchAction(new SyncActionDescriptor(ChooseRepositoryAction, ChooseRepositoryAction.ID, null), null);
registry.registerWorkbenchAction(new SyncActionDescriptor(ChooseReferenceAction, ChooseReferenceAction.ID, null), null);
