import React, { useState } from 'react'
import Navbar from '../components/Navbar'
import Select from 'react-select';
import { BsStars } from "react-icons/bs";
import { HiOutlineCode } from "react-icons/hi";
import Editor from '@monaco-editor/react';
import { IoCopy } from "react-icons/io5";
import { PiExportBold } from "react-icons/pi";
import { ImNewTab } from "react-icons/im";
import { FiRefreshCcw } from "react-icons/fi";
import { IoCloseSharp } from "react-icons/io5";


import { ClipLoader } from 'react-spinners';
import { GoogleGenAI } from '@google/genai';

import { toast } from 'react-toastify';

const Home = () => {

  const options = [
    { value: 'html-css', label: 'HTML + CSS' },
    { value: 'html-tailwind', label: 'HTML + Tailwind CSS' },
    { value: 'html-bootstrap', label: 'HTML + Bootstrap' },
    { value: 'html-css-js', label: 'HTML + CSS + JS' },
    { value: 'html-tailwind-bootstrap', label: 'HTML + Tailwind +  Bootstrap' },
    
  ];

  const [outputScreen,setoutputScreen]=useState(false);
  const [tab,setTab]=useState(1);
  const [prompt,setPrompt]=useState("");
  const [framework,setFrameWork]=useState(options[0]);
  const [code,setCode]=useState("");
  const [loading,setLoading]=useState(false);
  const [isNewtabOpen,setIsNewTabOpen]=useState(false);

 function extractCode(response){
  const match=response.match(/```(?:\w+)?\n?([\s\S]*?)```/);
  return match ? match[1].trim():response.trim();
 }




  // The client gets the API key from the environment variable `GEMINI_API_KEY`.

  const ai=new GoogleGenAI({apiKey:"AIzaSyAH9y7bi1WTQhTo0eq6W0QaZs-rZgJhk5s"});
 async function getResponse() {

  setLoading(true);
  
    const response = await ai.models.generateContent({
      model:"gemini-2.5-flash",
      contents:`
      You are an experienced programmer with expertise in web development and UI/UX design. You create modern,animated and fully responsive UI componentes. You are highlt skilled in HTML,CSS,Bootstrap,Javascript, React.js
      Now,generate a UI component for:${prompt}
      Framework to use :${framework.value}

      Requirements:
      -The code must be clean,well-structured,and easy to understand.
      -Optimize for SEO where applicable.
      -Focus on creating a modern,animated, and responsive UI design.
      -Include high-quality hover effects, shadows,animation,colors,and typography.
      -Return ONLY code, formatted properly in "Markdown fenced code blocks**.
      -Do NOT include explanations, text,comments,or anythings else besides the code. 
      `,
    });
    console.log(response.text);
    setCode(extractCode(response.text));
    setoutputScreen(true);
    setLoading(false);
  };

  const copyCode= async()=>{
    try{
      await navigator.clipboard.writeText(code);
      toast.success("Code copied to clipboard")
    }catch(err){
      console.error('Failed to copy:',err);
      toast.error("Failed to copy")
    }
  };

  const downloadFile=()=>{
    const fileName="GenUI-Code.html"
    const blob =  new Blob([code],{type:"text/plain"});
    let url= URL.createObjectURL(blob);
    const link=document.createElement('a');
    link.href=url;
    link.download=fileName;
    link.click();
    URL.revokeObjectURL(url);
    toast.success("File downloaded");


  };



    const darkStyles = {
  control: (base, state) => ({
    ...base,
    backgroundColor: "#1f1f1f",   
    borderColor: state.isFocused ? "#555" : "#333",
    boxShadow: "none",
    "&:hover": {
      borderColor: "#777",
    },
  }),
  menu: (base) => ({
    ...base,
    backgroundColor: "#1f1f1f",
  }),
  option: (base, state) => ({
    ...base,
    backgroundColor: state.isFocused ? "#2a2a2a" : "#1f1f1f",
    color: "#e5e5e5",
    cursor: "pointer",
  }),
  singleValue: (base) => ({
    ...base,
    color: "#ffffff",
  }),
  placeholder: (base) => ({
    ...base,
    color: "#9ca3af", // gray-400
  }),
  input: (base) => ({
    ...base,
    color: "#ffffff",
  }),
};
 
  

  return (
    <>
      <Navbar/>
      <div className='flex items-center px-[100px] justify-between gap-[30px]'>

        <div className="left  w-[80%] h-[auto] py-[30px] rounded-xl bg-[#141319] mt-5 p-[20px]">
          <h3 className='text-[25px] font-semibold sp-text'>
            AI component generator
          </h3>

          <p className='text-[gray] mt-2 text-[16px]'>
            Describe your component and let AI will code for you.
          </p>
          <p className='text-[15px] font-[500] mt-4'>Framework</p>
          <Select 
            styles={darkStyles}
            options={options}
            className="mt-4"
            onChange={(e)=>{
              setFrameWork(e)
              console.log(e.value)
            }
            }
          />
          <p className='text-[15px] font-[600] mt-5'>Describe your component</p>
          <textarea onChange={(e)=>{setPrompt(e.target.value)}} value={prompt} className=' w-full min-h-[180px] rounded-xl bg-[#090908] mt-3 p-[10px]' placeholder='Describe your component in detail and let ai will code for your component.'></textarea>
          <div className="flex items-center justify-between">
            <p className='text-[gray]'>Click on generate button to generate your code</p>
          <button  onClick={getResponse} className="generate  flex items-center p-[15px] rounded-lg border-0 bg-gradient-to-r from-purple-400  to-purple-600 mt-3 ml-auto px-[20px] gap-[10px] transition-all hover:opacity-[.8] ">
            {
              loading===false?
              <>
              <i><BsStars /></i>
              </>:""
            }
            {
            loading===true ?
            <>
             
            <ClipLoader  color='white' size={20}/>
      
            </>:""

          }
            Generate</button>
          </div>
        </div>
        <div className="right relative w-[80%] h-[90vh] bg-[#141319] rounded-xl mt-3">
        {
          outputScreen===false?
          <>
         
         
          <div className="skeleton w-full h-full flex items-center flex-col justify-center">
            <div className="circle p-[20px] w-[60px] h-[60px] rounded-[50%] flex items-center justify-center text-[30px] bg-gradient-to-r from-purple-400  to-purple-600"><HiOutlineCode /></div>
            <p className='text-[16px] text-[gray] mt-2'>Your component & code will appear here.</p>
            </div>
            </>:<>
            <div className='top w-full h-[60px]  flex items-center gap-[15px] px-[20px]'>
              <button onClick= {()=>{setTab(1)}} className={`btn w-[50%] p-[10px]  rounded-xl cursor-pointer transition-all ${tab===1?"bg-gradient-to-r from-purple-500 to-purple-700 text-white shadow-lg" 
    : "bg-transparent text-gray-400 hover:bg-[#222]"}`}>Code</button>
              <button onClick= {()=>{setTab(2)}} className={`btn w-[50%] p-[10px]  rounded-xl cursor-pointer transition-all ${tab===2?"bg-gradient-to-r from-purple-500 to-purple-700 text-white shadow-lg" 
    : "bg-transparent text-gray-400 hover:bg-[#222]"}`}>Preview</button>

            </div>
            <div className="top-2 bg-[#17171C] w-full h-[60px] flex items-center justify-between gap-[15px] px-[20px]">
              <div className="left">
                <p className='font-bold'>CodeEditor</p>
              </div>
              <div className="right flex items-center gap-[10px]">
              {
                tab=== 1 ?
                <>
                <button className="copy w-[40px] h-[40px] rounded-xl border-[1px] border-zinc-900 flex items-center justify-center transition-all hover:bg-[#333]" onClick={copyCode} ><IoCopy /></button>
                <button className="export w-[40px] h-[40px] rounded-xl border-[1px] border-zinc-900 flex items-center justify-center transition-all hover:bg-[#333]" onClick={downloadFile}><PiExportBold /></button>
                </>
                :
                <>
                <button className="copy w-[40px] h-[40px] rounded-xl border-[1px] border-zinc-900 flex items-center justify-center transition-all hover:bg-[#333] " onClick={()=>{setIsNewTabOpen(true)}}><ImNewTab /></button>
                <button className="export w-[40px] h-[40px] rounded-xl border-[1px] border-zinc-900 flex items-center justify-center transition-all hover:bg-[#333]"><FiRefreshCcw /></button>
                </>
                
                

              }
                
              </div>
            </div>
            <div className="editor h-full">
            {
              tab===1 ?
              <>
              <Editor height="100%" theme="vs-dark"  language="html"   value={code} />
              </>:
              <>
              <iframe srcDoc={code} className='preview w-full h-full bg-white text-black flex-items-center justify-center'>

              </iframe>
              </>

            }

             
            </div>
            </>
           
        } 
        </div>
      </div>
      { isNewtabOpen === true ? (
      <>
     <div className="container absolute left-0 top-0 right-0 bottom-0 bg-white w-screen min-h-screen overflow-auto">
      <div className="top text-black w-full h-[60px] flex items-center justify-between px-[20px]">
        <div className="left">
          <p className="font-bold">Preview</p>
        </div>
        <div className="right flex items-center gap-[10px]">
          <button
            className="copy w-[40px] h-[40px] rounded-xl border-[1px] border-zinc-800 flex items-center justify-center transition-all hover:bg-[#333]"
            onClick={() => setIsNewTabOpen(false)}>
            <IoCloseSharp />
          </button>
        </div>
      </div>
      <iframe srcDoc={code} className="w-full h-full"></iframe>
    </div>
    </>
  ) : (
    ""
)}
    </>
  )
}

export default Home