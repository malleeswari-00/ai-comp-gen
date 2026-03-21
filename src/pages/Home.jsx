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
import { GoogleGenAI } from "@google/genai";

const Home = () => {

  const options = [
    { value: 'html-css', label: 'HTML + CSS' },
    { value: 'html-tailwind', label: 'HTML + Tailwind CSS' },
    { value: 'html-bootstrap', label: 'HTML + Bootstrap' },
    { value: 'html-css-js', label: 'HTML + CSS + JS' },
    { value: 'html-tailwind-bootstrap', label: 'HTML + Tailwind +  Bootstrap' },
    
  ];

  const [outputScreen,setoutputScreen]=useState(true);
  const [tab,setTab]=useState(1);
  const [prompt,setPrompt]=useState("");
  const [framework,setFrameWork]=useState(options[0]);


  // The client gets the API key from the environment variable `GEMINI_API_KEY`.
  const ai = new GoogleGenAI({apiKey:" AIzaSyDD-UOMgYD5VmZVBv1J93T0vOxd2eZbN6k"});
  async function getResponse() {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: "Explain how AI works in a few words",
  });
  console.log(response.text);
}


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
              setFrameWork(e.value)
              console.log(e.value)
            }
            }
          />
          <p className='text-[15px] font-[600] mt-5'>Describe your component</p>
          <textarea onChange={(e)=>{setPrompt(e.target.value)}} value={prompt} className=' w-full min-h-[180px] rounded-xl bg-[#090908] mt-3 p-[10px]' placeholder='Describe your component in detail and let ai will code for your component.'></textarea>
          <div className="flex items-center justify-between">
            <p className='text-[gray]'>Click on generate button to generate your code</p>
          <button  onClick={getResponse} className="generate  flex items-center p-[15px] rounded-lg border-0 bg-gradient-to-r from-purple-400  to-purple-600 mt-3 ml-auto px-[20px] gap-[10px] transition-all hover:opacity-[.8] "><i><BsStars /></i>Generate</button>
          </div>
        </div>
        <div className="right w-[80%] h-[90vh] bg-[#141319] rounded-xl mt-3">
        {
          outputScreen===false?
          <>
          
          <div className="skeleton w-full h-full flex items-center flex-col justify-center">
            <div className="circle p-[20px] w-[60px] h-[60px] rounded-[50%] flex items-center justify-center text-[30px] bg-gradient-to-r from-purple-400  to-purple-600"><HiOutlineCode /></div>
            <p className='text-[16px] text-[gray] mt-2'>Your component & code will appear here.</p>
            </div>
            </>:<>
            <div className='top w-full h-[60px]  flex items-center gap-[15px] px-[20px]'>
              <button onClick= {()=>{setTab(1)}} className={`btn w-[50%] p-[10px]  rounded-xl cursor-pointer transition-all ${tab===1?"bg-[#333]":""}`}>Code</button>
              <button onClick= {()=>{setTab(2)}} className={`btn w-[50%] p-[10px]  rounded-xl cursor-pointer transition-all ${tab===2?"bg-[#333]":""}`}>Preview</button>

            </div>
            <div className="top-2 bg-[#17171C] w-full h-[60px] flex items-center justify-between gap-[15px] px-[20px]">
              <div className="left">
                <p className='font-bold'>CodeEditor</p>
              </div>
              <div className="right flex items-center gap-[10px]">
              {
                tab=== 1 ?
                <>
                <button className="copy w-[40px] h-[40px] rounded-xl border-[1px] border-zinc-900 flex items-center justify-center transition-all hover:bg-[#333] "><IoCopy /></button>
                <button className="export w-[40px] h-[40px] rounded-xl border-[1px] border-zinc-900 flex items-center justify-center transition-all hover:bg-[#333]"><PiExportBold /></button>
                </>
                :
                <>
                <button className="copy w-[40px] h-[40px] rounded-xl border-[1px] border-zinc-900 flex items-center justify-center transition-all hover:bg-[#333] "><ImNewTab /></button>
                <button className="export w-[40px] h-[40px] rounded-xl border-[1px] border-zinc-900 flex items-center justify-center transition-all hover:bg-[#333]"><FiRefreshCcw /></button>
                </>
                
                

              }
                
              </div>
            </div>
            <div className="editor h-full">
            {
              tab===1 ?
              <>
              <Editor height="100%" theme="vs-dark"  language="html"  defaultValue="" />
              </>:
              <>
              <div className='preview w-full h-full bg-white text-black flex-items-center justify-center'></div>
              </>

            }

             
            </div>
            </>
           
        } 
        </div>
      </div>
    </>
  )
}

export default Home