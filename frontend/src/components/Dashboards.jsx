import React, { useEffect, useState } from 'react';
import { useWidgetContext } from '../WidgetsContext';
import 'boxicons';

const Dashboards = () => {
    const { state, dispatch } = useWidgetContext();
    const [windowOpen, setWindowOpen] = useState(false);
    const [scrollPosition, setScrollPosition] = useState(0);
    const [title, setTitle] = useState([]);
    const [checkedItems, setCheckedItems] = useState([]);
    const [activeIndex, setActiveIndex] = useState(0);
    const [newTitle, setNewTitle] = useState('');
    const [newContent, setNewContent] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const savedCheckedItems = localStorage.getItem('checkedItems');
        if (savedCheckedItems) {
            setCheckedItems(JSON.parse(savedCheckedItems));
        }
    }, []);

    useEffect(() => {
        fetchTitles();
    }, [state]);

    useEffect(() => {
        if (windowOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
    }, [windowOpen]);

    useEffect(() => {
        localStorage.setItem('checkedItems', JSON.stringify(checkedItems));
    }, [checkedItems]);

    const fetchTitles = () => {
        const titles = Object.keys(state);
        setTitle(titles);
    };

    const handleOpenSideBar = () => {
        setScrollPosition(window.scrollY);
        setWindowOpen(true);
        document.body.style.position = 'fixed';
        document.body.style.top = -`${window.scrollY}px`;
        document.body.style.width = '100%';
    };

    const handleCloseSidebar = () => {
        setWindowOpen(false);
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
        if (newTitle.trim() && newContent.trim()) {
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

    const handleDeleteWidget = (category, key) => {
        dispatch({
            type: 'REMOVE_WIDGET',
            payload: { category, key }
        });
    };

    const filteredWidgets = (category) => {
        return (state[category] || []).filter(widget => 
            widget.title.toLowerCase().includes(searchTerm.toLowerCase())
        );
    };

    return (
        <>
            <div className='w-full'>
                <div className="mb-10 ">
                    {/* Search Bar */}
                    <div className="flex px-3 items-center self-center py-2 justify-between gap-10 bg-blue-900 ">
                        <div className="w-[50%]">
                            <input
                                type="text"
                                placeholder="Search widgets..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="border p-2 w-full rounded-md"
                            />
                        </div>
                        <div>
                            <button className="text-blue-900 font-semibold bg-white text-sm px-2 py-1 border-2 rounded-md" onClick={handleOpenSideBar}>+ Add Widget</button>
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 py-1 px-3 font-sans">
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
                                        <button className="text-blue-900 text-sm px-2 py-1 border-2 border-blue-900 font-semibold rounded-md hover:bg-blue-900 hover:border-none hover:text-white" onClick={handleOpenSideBar}>+ Add Widget</button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {windowOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-40 z-40" onClick={handleCloseSidebar}></div>
            )}

            {/* Sidebar */}
            <aside className={`${windowOpen ? 'w-[50%] h-screen duration-500' : 'w-0 h-screen overflow-hidden duration-300'} fixed bg-white top-0 right-0 z-50 shadow-lg`}>
                <div className="flex justify-between">
                    <div className={`${windowOpen ? 'w-full h-10' : 'w-0 h-0'} absolute py-2 px-2 text-white bg-blue-900`}>
                        Add Widget
                    </div>
                    <button onClick={handleCloseSidebar} className={`${windowOpen ? 'w-10 h-10' : 'w-0 h-0'} absolute right-0 bg-blue-900 text-white`}>
                        <box-icon name='x' color='#fffefe'></box-icon>
                    </button>
                </div>
                <p className='pt-14 pl-2 pb-5 overflow-hidden'>Personalize your dashboard by adding or removing widgets</p>
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
                            <div key={item.key} className={`flex gap-5 ml-3 text-blue ${activeIndex === groupIndex ? '' : 'hidden'}`}>
                                <input
                                    className='accent-blue-900'
                                    type="checkbox"
                                    checked={checkedItems.includes(item.key)}
                                    onChange={() => handleCheckboxChange(item.key)}
                                />
                                <h2>{item.title}</h2>
                                <button 
                                    className="ml-2 text-red-500 hover:text-red-700" 
                                    onClick={() => handleDeleteWidget(category, item.key)}
                                >
                                    <box-icon name='trash' color='#4000ff'></box-icon>
                                </button>
                            </div>
                        ))}
                    </div>
                ))}

                <div className="flex flex-col ml-2 mt-5">
                    <h2 className="text-lg font-semibold">Add New Widget</h2>
                    <label className="mt-4">Title</label>
                    <textarea
                        className='w-full p-2 mt-2 active:border-blue-200 outline-none border-2 h-10 border-blue-900'
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                    />
                    <label className="mt-4">Content</label>
                    <textarea
                        className='w-full h-20 p-2 mt-2 active:border-blue-200 outline-none border-2 border-blue-900'
                        value={newContent}
                        onChange={(e) => setNewContent(e.target.value)}
                    />
                    <div className="flex justify-between w-[20%] mt-4">
                        <button onClick={handleCancel} className="px-2 py-1 border-blue-900 text-blue-900 border-2 rounded-md">Cancel</button>
                        <button onClick={handleConfirm} className="px-2 py-1 bg-blue-900 text-white rounded-md">Confirm</button>
                    </div>
                </div>
            </aside>
        </>
    );
};

export default Dashboards;
