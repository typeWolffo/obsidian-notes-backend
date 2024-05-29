"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotesService = void 0;
const axios_1 = __importDefault(require("axios"));
const gray_matter_1 = __importDefault(require("gray-matter"));
const ts_pattern_1 = require("ts-pattern");
const owner = process.env.GITHUB_OWNER;
const repo = process.env.GITHUB_REPO;
const branch = process.env.GITHUB_BRANCH;
const token = process.env.GITHUB_TOKEN;
const getFileList = async () => {
    const url = `https://api.github.com/repos/${owner}/${repo}/git/trees/${branch}?recursive=1`;
    const headers = { Authorization: `token ${token}` };
    const response = await axios_1.default.get(url, { headers });
    return response.data.tree.filter((file) => file.path.endsWith(".md"));
};
const getFileContent = async (filePath) => {
    const url = `https://api.github.com/repos/${owner}/${repo}/contents/${filePath}`;
    const headers = {
        Authorization: `token ${token}`,
        Accept: "application/vnd.github.v3.raw",
    };
    const response = await axios_1.default.get(url, { headers });
    return response.data;
};
const processContent = (content) => {
    const sections = content.split(/(#hidden|#visible)/);
    const { result } = sections.reduce(({ isVisible, result }, section) => {
        const newVisibility = (0, ts_pattern_1.match)(section)
            .with("#hidden", () => false)
            .with("#visible", () => true)
            .otherwise(() => isVisible);
        const newResult = section !== "#hidden" && section !== "#visible" && newVisibility
            ? result + section
            : result;
        return {
            isVisible: newVisibility,
            result: newResult,
        };
    }, { isVisible: true, result: "" });
    return result;
};
class NotesService {
    async getNotes() {
        const files = await getFileList();
        const notes = await Promise.all(files.map(async (file) => {
            const content = await getFileContent(file.path);
            const { data: frontMatter, content: markdownContent } = (0, gray_matter_1.default)(content);
            console.log(frontMatter);
            if (frontMatter.visible === false) {
                return null;
            }
            const visibleContent = processContent(markdownContent);
            return { filename: file.path, content: visibleContent };
        }));
        return notes.filter((note) => note !== null);
    }
}
exports.NotesService = NotesService;
