import React, { useEffect, useState } from 'react';
import {WidgetProvider,useWidgetContext} from '../WidgetsContext'

const Dashboards = () => {
  const { state, dispatch } = useWidgetContext();
  const [window, setWindow] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [title, setTitle] = useState([]);
  const [checkedItems, setCheckedItems] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [searchTerm, setSearchTerm] = useState(''); // State for search term

  const fetchTitles = () => {
    const titles = Object.keys(state);
    setTitle(titles);
  };

  useEffect(() => {
    fetchTitles();
  }, [state]);

  useEffect(() => {
    if (window) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [window]);

  const handleOpenSideBar = () => {
    setScrollPosition(window.scrollY);
    setWindow(true);
    document.body.style.position = 'fixed';
    document.body.style.top = -`${window.scrollY}px`;
    document.body.style.width = '100%';
  };

  const handleCloseSidebar = () => {
    setWindow(false);
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.width = '';
  };

  const handleCheckboxChange = (itemKey) => {
    if (checkedItems.includes(itemKey)) {
      setCheckedItems(checkedItems.filter(key => key !== itemKey));
    } else {
      setCheckedItems([...checkedItems, itemKey]);
    }
  };

  const handleAddWidget = () => {
    setNewTitle('');
    setNewContent('');
  };

  const handleCancel = () => {
    setNewTitle('');
    setNewContent('');
    handleCloseSidebar();
  };

  const handleConfirm = () => {
   if(newTitle.length >0 && newContent.length > 0 && newTitle[0] !== ' ' && newContent[0] !== ' ' ){
    const newItem = {
      title: newTitle,
      content: newContent,
      key: Date.now(),
    };

    const category = title[activeIndex];
    
    dispatch({
      type: 'ADD_WIDGET',
      payload: { category, widget: newItem }
    });
    
   }
    handleCloseSidebar();
    handleAddWidget();
  };

  // search bar functionality
  const filteredWidgets = (category) => {
    return (state[category] || []).filter(widget => 
      widget.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  return (
    <>
      <div className='w-full'>
        <div className="mt-10 m-auto px-2 mb-10">
          {/* Search Bar */}
          <div className="mb-4 px-2">
            <input
              type="text"
              placeholder="Search widgets..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border p-2 w-full rounded-md"
            />
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 py-1 px-2 font-sans">
            {title.map((category, groupIndex) => (
              <div key={groupIndex} className="col-span-full">
                <div className="font-bold text-lg mb-4">{category}</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredWidgets(category).map((item) => (
                    checkedItems.includes(item.key) && (
                      <div key={item.key} className="bg-gray-50 text-zinc-900 shadow-md py-2 px-2 rounded-lg flex flex-col">
                        <div className="font-semibold">{item.title}</div>
                        <div className="pt-2">{item.content}</div>
                      </div>
                    )
                  ))}
                  <div className="flex justify-center items-center w-full h-[150px] bg-gray-50 rounded-lg shadow-md">
                    <button className="text-gray-400 text-sm px-2 py-1 border-2 border-zinc-300 rounded-md" onClick={handleOpenSideBar}>+ Add Widget</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {window && (
        <div className="fixed inset-0 bg-black bg-opacity-40 z-40" onClick={handleCloseSidebar}></div>
      )}

      {/* Sidebar */}
      <aside className={`${window ? 'w-[50%] h-screen duration-500' : 'w-0 h-screen overflow-hidden duration-300'} fixed bg-white top-0 right-0 z-50 shadow-lg`}>
        <div className="flex justify-between">
          <div className={`${window ? 'w-full h-10' : 'w-0 h-0'} absolute py-2 px-2 text-white bg-blue-900`}>
            Add Widget
          </div>
          <button onClick={handleCloseSidebar} className={`${window ? 'w-10 h-10' : 'w-0 h-0'} absolute right-0 bg-blue-900 text-white`}>
            X
          </button>
        </div>
        <p className='pt-14 pl-2 pb-5 overflow-hidden'>Personalize your dashboard by adding the following widget</p>
        <div className="flex gap-5">
          {title.map((category, groupIndex) => (
            <div key={groupIndex} className={`text-black ml-2 cursor-pointer ${activeIndex === groupIndex ? 'border-b-2 border-blue-900' : ''} border-b-2`}
            onClick={() => setActiveIndex(groupIndex)}
            >
              {category}
            </div>
          ))}
        </div>

        {title.map((category, groupIndex) => (
          <div key={groupIndex} className={`mt-4`}>
            {(state[category] || []).map((item) => (
              <div key={item.key} className={`flex gap-5 ml-2 text-blue ${activeIndex === groupIndex ? '' : 'hidden'}`}>
                <input
                  className='accent-blue-900'
                  type="checkbox"
                  checked={checkedItems.includes(item.key)}
                  onChange={() => handleCheckboxChange(item.key)}
                />
                <h2>{item.title}</h2>
              </div>
            ))}
          </div>
        ))}

        <div className="flex flex-col ml-2 mt-5">
          <h2 className="text-lg font-semibold">Add New Widget</h2>
          <label className="mt-4">Title</label>
          <textarea
            className='border w-full h-10 p-2 mt-2 active:border-blue-200'
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
          />
          <label className="mt-4">Content</label>
          <textarea
            className='border w-full h-20 p-2 mt-2 active:border-blue-200'
            value={newContent}
            onChange={(e) => setNewContent(e.target.value)}
          />
          <div className="flex justify-between w-[20%] mt-4">
            <button onClick={handleCancel} className="px-4 py-2 bg-red-500 text-white rounded-md">Cancel</button>
            <button onClick={handleConfirm} className="px-4 py-2 bg-blue-500 text-white rounded-md">Confirm</button>
          </div>
        </div>

      </aside>
    </>

  );
};

export default Dashboards;
