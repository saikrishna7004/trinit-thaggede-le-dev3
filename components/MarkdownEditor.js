// components/MarkdownEditor.js
import React, { useState } from 'react';
import MarkdownIt from 'markdown-it';
import MarkdownEditor from 'react-markdown-editor-lite';
import 'react-markdown-editor-lite/lib/index.css';

const mdParser = new MarkdownIt(/* Markdown-it options */);

const CustomMarkdownEditor = () => {
	const [markdown, setMarkdown] = useState('');

	const handleEditorChange = ({ html, text }) => {
		setMarkdown(text);
	};

	return (
		<div className="markdown-container">
			<div className="markdown-editor">
				<MarkdownEditor
					onChange={handleEditorChange}
					renderHTML={text => mdParser.render(text)} 
					style={{ height: '400px' }}
				/>
			</div>
			<div className="markdown-preview markdown-body">
				<div dangerouslySetInnerHTML={{ __html: mdParser.render(markdown) }} />
			</div>
		</div>
	);
};

export default CustomMarkdownEditor;
