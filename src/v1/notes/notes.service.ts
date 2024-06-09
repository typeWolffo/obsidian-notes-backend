import axios from "axios";
import matter from "gray-matter";
import { match } from "ts-pattern";

const owner = process.env.GITHUB_OWNER;
const repo = process.env.GITHUB_REPO;
const branch = process.env.GITHUB_BRANCH;
const token = process.env.GITHUB_TOKEN;

const getFileList = async () => {
  const url = `https://api.github.com/repos/${owner}/${repo}/git/trees/${branch}?recursive=1`;
  const headers = { Authorization: `token ${token}` };
  const response = await axios.get(url, { headers });
  return response.data.tree.filter((file: any) => file.path.endsWith(".md"));
};

const getFileContent = async (filePath: string) => {
  const url = `https://api.github.com/repos/${owner}/${repo}/contents/${filePath}`;
  const headers = {
    Authorization: `token ${token}`,
    Accept: "application/vnd.github.v3.raw",
  };
  const response = await axios.get(url, { headers });
  return response.data;
};

const processContent = (content: any) => {
  const sections = content.split(/(#hidden|#visible)/);

  const { result } = sections.reduce(
    ({ isVisible, result }: any, section: any) => {
      const newVisibility = match(section)
        .with("#hidden", () => false)
        .with("#visible", () => true)
        .otherwise(() => isVisible);

      const newResult =
        section !== "#hidden" && section !== "#visible" && newVisibility
          ? result + section
          : result;

      return {
        isVisible: newVisibility,
        result: newResult,
      };
    },
    { isVisible: true, result: "" }
  );

  return result;
};

export class NotesService {
  async getNotes() {
    const files = await getFileList();
    const notes = await Promise.all(
      files.map(async (file: any) => {
        const content = await getFileContent(file.path);
        const { data: frontMatter, content: markdownContent } = matter(content);

        if (frontMatter.visible === false) {
          return null;
        }
        const visibleContent = processContent(markdownContent);

        return { filename: file.path, content: visibleContent };
      })
    );

    return notes.filter((note) => note !== null);
  }
}
