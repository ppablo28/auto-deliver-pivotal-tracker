"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const TeamcityChanges_1 = require("./TeamcityChanges");
const node_fetch_1 = require("node-fetch");
const CommitMessage_1 = require("../git/CommitMessage");
const TeamcityChange_1 = require("./TeamcityChange");
class TeamcityService {
    constructor() {
        this.username = process.env.TEAMCITY_USERNAME;
        this.password = process.env.TEAMCITY_PASSWORD;
        this.baseUrl = process.env.TEAMCITY_URL || 'http://localhost';
    }
    getCommitMessagesFromBuild(buildId) {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.getChangesFromBuild(buildId)).map((change) => {
                return new CommitMessage_1.CommitMessage(change.getCommitDescription());
            });
        });
    }
    getChangesFromBuild(buildId) {
        return __awaiter(this, void 0, void 0, function* () {
            const changesResponse = yield node_fetch_1.default(`${this.baseUrl}/changes?locator=build:id:${buildId}`);
            const changesXml = yield changesResponse.text();
            const teamcityChanges = new TeamcityChanges_1.TeamcityChanges(changesXml);
            const changesIds = teamcityChanges.getListOfIds();
            let changes = [];
            for (let i = 0; i < changesIds.length; i++) {
                changes.push(yield this.getChange(changesIds[i]));
            }
            return changes;
        });
    }
    getChange(changeId) {
        return __awaiter(this, void 0, void 0, function* () {
            const changeResponse = yield node_fetch_1.default(`${this.baseUrl}/changes/id:${changeId}`);
            const changeXml = yield changeResponse.text();
            return new TeamcityChange_1.TeamcityChange(changeXml);
        });
    }
}
exports.TeamcityService = TeamcityService;
//# sourceMappingURL=TeamcityService.js.map