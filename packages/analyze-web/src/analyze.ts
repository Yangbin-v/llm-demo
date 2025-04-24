/**
 * @description 分析网站
 */
import {ChatOpenAI} from '@langchain/openai';
import {CheerioWebBaseLoader as WebBaseLoader} from "@langchain/community/document_loaders/web/cheerio";
import {ChatPromptTemplate} from '@langchain/core/prompts';
import {StringOutputParser} from '@langchain/core/output_parsers';
import * as dotenv from 'dotenv';
dotenv.config();

/**
 * 加载网站
 * @param url 网站地址
 * @returns 网站内容
 */
async function loadWebsite(url: string) {
    const loader = new WebBaseLoader(url);
    const docs = await loader.load();
    return docs;
}

/**
 * 初始化链
 * @returns 链
 */
function initChain() {
    const llm = new ChatOpenAI({
        configuration: {
            baseURL: process.env.BASE_URL,
        },
        modelName: process.env.MODEL_NAME,
        apiKey: process.env.API_KEY,
        temperature: 0.2, // 温度低一些，让输出更稳定、基于事实
    });

    const promptTemplate = ChatPromptTemplate.fromMessages([
        [
            'system',
            `你是一个专业的电竞数据分析师。你的任务是从给定的网页文本内容中提取电竞比赛的关键信息。
                请识别并列出以下信息（如果存在）：
                - 参赛队伍 (Teams)
                - 比赛时间 (Time/Date)
                - 游戏项目 (Game)
                - 赛事名称 (Tournament Name)
                - 当前比分 (Score)
                - 比赛状态 (Status: 例如 即将开始/进行中/已结束)
                
                如果信息不明确或不存在，请注明。请用清晰、简洁的中文回答。`
        ],
        [
            'human',
            `这是从网页 {url} 提取的文本内容：\n\n{pageContent}\n\n请根据以上内容提取比赛信息。`
        ],
    ]);

    const chain = promptTemplate.pipe(llm).pipe(new StringOutputParser());

    return chain;
}

/**
 * 分析网站
 * @param url 网站地址
 * @returns 分析结果
 */
async function analyzeWebsite(url: string) {
    try {
        const chain = initChain();
        const docs = await loadWebsite(url);
        const result = await chain.invoke({
            url,
            pageContent: docs[0].pageContent,
        });
        return result;
    } catch (error) {
        console.error(error);
        return null;
    }
}

export {
    analyzeWebsite
};
