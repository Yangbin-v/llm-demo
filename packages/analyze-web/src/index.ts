import * as dotenv from 'dotenv';
import {analyzeWebsite} from './analyze';
dotenv.config();

async function main() {
    // 从命令行参数、配置文件或 API 请求中获取 URL
    const urlToAnalyze = process.argv[2];

    if (!urlToAnalyze) {
        console.error("请提供一个要分析的网址作为命令行参数。");
        console.log("用法: ts-node src/index.ts <url>");
        process.exit(1);
    }

    try {
        const result = await analyzeWebsite(urlToAnalyze);
        console.log("\n--- 分析结果 ---");
        console.log(result);
        console.log("-----------------");
    } catch (error) {
        console.error("运行分析时出错:", error);
    }
}

main();
