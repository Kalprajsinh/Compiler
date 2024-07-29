import React, { useEffect, useState } from "react";
import Editor from "@monaco-editor/react";
import axios from 'axios';

const helloWorldExamples = {
  python: 'print("Hello, World!")',
  c: '#include <stdio.h>\n\nint main() {\n    printf("Hello, World!\\n");\n    return 0;\n}',
  cpp: '#include <iostream>\n\nint main() {\n    std::cout << "Hello, World!" << std::endl;\n    return 0;\n}',
  java: 'public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello, World!");\n    }\n}',
  csharp: 'using System;\n\nclass Program {\n    static void Main() {\n        Console.WriteLine("Hello, World!");\n    }\n}',
  php: '<?php\n    echo "Hello, World!";\n?>',
  javascript: 'console.log("Hello, World!");'
};

const languageIds = {
  python: 71,
  c: 50,
  cpp: 54,
  java: 62,
  csharp: 51,
  php: 68,
  javascript: 63
};

const getLanguageId = (language) => {
  return languageIds[language];
};

const App = () => {
  const [code, setCode] = useState(helloWorldExamples.python);
  const [language, setLanguage] = useState('python');
  const [output, setOutput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLanguageChange = (e) => {
    const selectedLanguage = e.target.value;
    setLanguage(selectedLanguage);
    setCode(helloWorldExamples[selectedLanguage]);
  };

  const compileCode = async () => {
    const options = {
      method: 'POST',
      url: 'https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=false&wait=true',
      headers: {
        'x-rapidapi-key': '6129d442d1mshc5b312e0de8c457p183411jsn6a0870a6274a',
        'x-rapidapi-host': 'judge0-ce.p.rapidapi.com',
        'Content-Type': 'application/json'
      },
      data: {
        language_id: getLanguageId(language),
        source_code: code,
        stdin: ''
      }
    };

    setIsLoading(true);
    try {
      const response = await axios.request(options);
      setOutput(response.data.stdout || response.data.stderr);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setOutput('Error: ' + error.message);
      } else if (error instanceof Error) {
        setOutput('Error: ' + error.message);
      } else {
        setOutput('An unknown error occurred');
      }
    }
    setIsLoading(false);
  };

  return (
    <>
      <header className="flex justify-between items-center h-20 px-5 bg-gray-800 text-white">
        <p className="text-xl font-semibold">Compiler</p>
        <div>
          
        </div>
      </header>
      <main className="w-full h-screen flex bg-black">
        <section className="flex-1 h-4/5 flex flex-col justify-center items-center text-black border rounded-xl m-3 p-3 pb-16 bg-black shadow-lg">
          <div className="w-full h-10 font-bold text-white flex justify-between items-center bg-gray-700 p-2 rounded-t-lg">
            <span>Code Editor</span>
            <div className="flex items-center">
              <button 
                className="mx-2 px-3 py-1 bg-blue-600 rounded-lg hover:bg-blue-500 transition duration-300"
                onClick={compileCode}
                disabled={isLoading}
              >
                {isLoading ? 'Compiling...' : 'RUN'}
              </button>
              <select 
                className="px-2 py-1 rounded-lg bg-gray-600 text-white"
                value={language}
                onChange={handleLanguageChange}
              >
                <option value="python">Python</option>
                <option value="c">C</option>
                <option value="cpp">C++</option>
                <option value="java">Java</option>
                <option value="csharp">C#</option>
                <option value="php">PHP</option>
                <option value="javascript">Javascript</option>
              </select>
            </div>
          </div>
          <Editor
            defaultLanguage="python"
            language={language}
            value={code}
            theme="vs-dark"
            className="w-full h-full"
            onChange={(value) => setCode(value)}
          />
        </section>
        <section className="w-2/6 h-4/5 flex flex-col text-white border rounded-xl m-3 p-3 pb-16 bg-black shadow-lg">
          <h2 className="w-full text-xl font-bold text-center bg-gray-700 text-white p-2 rounded-t-lg">
            OUTPUT
          </h2>
          <hr className="w-full" />
          <pre className="w-full h-full p-2 bg-gray-900 rounded-b-lg overflow-auto">
            {output}
          </pre>
        </section>
      </main>
    </>
  );
};

export default App;
