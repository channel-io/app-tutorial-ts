import axios from 'axios';
import * as crypto from 'crypto';


require("dotenv").config();

let channelTokenMap = new Map<string, [string, string, number]>();

const tutorialMsg = "This is a test message sent by a manager.";
const sendAsBotMsg = "This is a test message sent by a bot.";
const botName = "Bot";

const defaultWamArgs = ["rootMessageId", "broadcast", "isPrivate"];

async function getChannelToken(channelId: string): Promise<[string, string]> {
    const channelToken = channelTokenMap.get(channelId);
    if (channelToken === undefined || channelToken[2] < new Date().getTime() / 1000) {
        const [accessToken, refreshToken, expiresAt]: [string, string, number] = await requestIssueToken(channelId);
        channelTokenMap.set(channelId, [accessToken, refreshToken, expiresAt]);
        return [accessToken, refreshToken]
    }
    else {
        return [channelToken[0], channelToken[1]]
    }
}

async function requestIssueToken(channelId?: string): Promise<[string, string, number]> {
    let body = {
        method: 'issueToken',
        params: {
            secret: process.env.APP_SECRET,
            channelId: channelId
        }
    };

    const headers = {
        'Content-Type': 'application/json'
    };

    const response = await axios.put(process.env.APPSTORE_URL ?? '', body, { headers });

    const accessToken = response.data.result.accessToken;
    const refreshToken = response.data.result.refreshToken;
    const expiresAt = new Date().getTime() / 1000 + response.data.result.expiresIn - 5;

    return [accessToken, refreshToken, expiresAt];
}

async function registerCommand(accessToken: string) {
    const body = {
        method: "registerCommands",
        params: {
            appId: process.env.APP_ID,
            commands: [
                {
                    name: "tutorial",
                    scope: "desk",
                    description: "This is a desk command of App-tutorial",
                    actionFunctionName: "tutorial",
                    alfMode: "disable",
                    enabledByDefault: true,
                }
            ]
        }
    };

    const headers = {
        'x-access-token': accessToken,
        'Content-Type': 'application/json'
    };

    const response = await axios.put(process.env.APPSTORE_URL ?? '', body, { headers });

    if (response.data.error != null) {
        throw new Error("register command error");
    }
}

async function sendAsBot(channelId: string, groupId: string, broadcast: boolean, rootMessageId?: string) {
    const body = {
        method: "writeGroupMessage",
        params: {
            channelId: channelId,
            groupId: groupId,
            rootMessageId: rootMessageId,
            broadcast: broadcast,
            dto: {
                plainText: sendAsBotMsg,
                botName: botName
            }
        }
    }

    const channelToken = await getChannelToken(channelId);

    const headers = {
        'x-access-token': channelToken[0],
        'Content-Type': 'application/json'
    };

    const response = await axios.put(process.env.APPSTORE_URL ?? '', body, { headers });

    if (response.data.error != null) {
        throw new Error("send as bot error");
    }
}

function verification(x_signature: string, body: string): boolean {
    const key: crypto.KeyObject = crypto.createSecretKey(Buffer.from(process.env.SIGNING_KEY ?? '', 'hex'));
    const mac = crypto.createHmac('sha256', key);
    mac.update(body, 'utf8');

    const signature: string = mac.digest('base64');
    return signature === x_signature;
}

function tutorial(wamName: string, callerId: string, params: any) {
    const wamArgs = {
        message: tutorialMsg,
        managerId: callerId,
    } as { [key: string]: any }

    if (params.trigger.attributes) {
        defaultWamArgs.forEach(k => {
            if (k in params.trigger.attributes) {
                wamArgs[k] = params.trigger.attributes[k]
            }
        })
    }

    return ({
        result: {
            type: "wam",
            attributes: {
                appId: process.env.APP_ID,
                name: wamName,
                wamArgs: wamArgs,
            }
        }
    });
}

export { requestIssueToken, registerCommand, sendAsBot, tutorial, verification };
