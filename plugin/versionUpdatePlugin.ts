import path from 'path';
import fs from 'fs';
import { PluginOption, ResolvedConfig } from 'vite';

export interface IOptions {
    version: string
}

// 生成版本号
let versionUpdatePlugin = (options: IOptions): PluginOption => {
    let config: ResolvedConfig

    let writeVersion = (versionFile: string, content: string) => {
        // 写入文件
        fs.writeFile(versionFile, content, (err) => {
            if (err) throw err
        })
    }

    return {
        name: 'version-update',
        enforce: "post",
        configResolved(resolvedConfig) {
            // 存储最终解析的配置
            config = resolvedConfig
        },
        closeBundle: {
            order: 'pre',
            handler() {
                if (config.mode == "production") {
                    console.log("开始生成版本号");

                    // 获取build的输出目录
                    let outDir = config.build.outDir;

                    // 拼接路径
                    const file = outDir + path.sep + 'version.json'
                    const content = JSON.stringify({ version: options.version })

                    if (fs.existsSync(outDir)) {
                        writeVersion(file, content)
                    } else {
                        fs.mkdir(outDir, (err) => {
                            if (err) throw err
                            writeVersion(file, content)
                        })
                    }
                }
            },
        }

    }
}

export default versionUpdatePlugin;