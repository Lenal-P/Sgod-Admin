import { ContentState, EditorState } from 'draft-js';
import htmlToDraft from 'html-to-draftjs';

export const htmlToDraftBlocks = (html: string): EditorState => {
  const blocksFromHtml = htmlToDraft(html);
  const { contentBlocks, entityMap } = blocksFromHtml;
  const editorState = ContentState.createFromBlockArray(contentBlocks, entityMap);

  return EditorState.createWithContent(editorState);
}
