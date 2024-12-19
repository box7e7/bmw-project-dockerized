import { useState,useEffect } from 'react';
import React from 'react';
import { useUser } from '@auth0/nextjs-auth0/client';
import DateRangeSelector from '../components/DateRangeSelector';
import "react-datepicker/dist/react-datepicker.css";
import Logo from './Logo';
import { XMarkIcon } from '@heroicons/react/24/outline';

// function extractZipCode(address) {
//   const regex = /,\s*TX\s+(\d{5}(?:-\d{4})?)\b/;

//     const match = address.match(regex);
//     const zipCode = match ? match[1] : null ;
//     return zipCode
// }

// function extractZipCode(address) {
//   const regex = /\b(\d{5}(?:-\d{4})?)\b/;
//   const match = address.match(regex);
//   const zipCode = match ? match[1] : null;
//   return zipCode;
// }


function extractZipCode(address) {
  const regexPattern = /\b\d{5}\b/g; // 'g' modifier for global search
  const matches = address.match(regexPattern);
  return matches || [];
}

function parseJsonFromString(str) {
  try {
      // Convert to valid JSON string format
      let jsonString = str.replace(/'/g, '"').replace(/(\w+):/g, '"$1":');
      return JSON.parse(jsonString);
  } catch (e) {
      console.error("Error parsing JSON from string:", e);
      return null;
  }
}


const callApi = async (setState) => {
  setState(previous => ({ ...previous, isLoading: true }));

  try {
    const response = await fetch('/api/getData');
    const data = await response.json();

    if(response.error){
      setState(previous => ({ ...previous, response: data, error: response.error }));
    }
    else{
      setState(previous => ({ ...previous, response: data, error: undefined }));
    }
  } catch (error) {
    setState(previous => ({ ...previous, response: undefined, error }));
  } finally {
    setState(previous => ({ ...previous, isLoading: false }));
  }
};









const Hero = () =>{
  const [state, setState] = useState({ isLoading: false, response: undefined, error: undefined });
  const [dispatch, setDispatch] = useState([]);
  const [files, setFiles] = useState([]);
  const [editItem, setEditItem] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [startDate, setStartDate] = useState(new Date(Date.now() - 24 * 3600 * 1000));
  const [endDate, setEndDate] = useState(new Date());
  const [newFieldName, setNewFieldName] = useState('');
  const [newFieldValue, setNewFieldValue] = useState('');
  const [newFieldType, setNewFieldType] = useState('text');
  const [customFields, setCustomFields] = useState({});
  const [updateMessage, setUpdateMessage] = useState('');
  const { user, error, isLoading } = useUser();

  // console.log("//// start date /////\n",startDate)
  // console.log("//// end date /////\n",endDate)
  //  console.log("/////$$$ files $$$/////\n",files)

  console.log("//// state ////\n",state)
  console.log("//// Dispatch ////\n",dispatch)

  let sum=0
  Array.isArray(state.response) ? state.response?.forEach(element => {
    sum=sum+element.price
  }) :  null;


  const handleEndDateChange = async(date) => {
    if (date >= startDate) {
      setEndDate(date);
      }
      else{
        alert("select account name first then select date range again")
      }
    }


    const handleCheckboxChange = (e, item) => {
      // Update your state to reflect the new checked status
      // Assuming you have a method to update your state, it might look something like this:
      const updatedItems = state.response.map(it => {
        if (it.PO === item.PO) {
        let item_json={ ...it, update: e.target.checked }
          // Make the GET request
        fetch(`/api/updateItem?obj=${JSON.stringify(item_json)}`)
            .then(response => response.json())
            .then(data => console.log("///// update item fetch /////",data))
            .catch(error => console.error('Error:', error));
          return item_json; // Update the 'update' field based on checkbox status
        }
        return it;
      });
    
      // Call your state update method here, e.g., setState({ ...state, response: updatedItems });
      setState({ ...state, response: updatedItems });
    };
  

    const handleDispatchCheckboxChange = (e, item) => {

      console.log("//// checked ////",e.target.checked)

      // e.target is the input element
      const inputElement = e.target;

      // Traverse up to get the TD element
      const tdElement = inputElement.parentElement.parentElement;
      console.log("&&&&&&&",tdElement)


      if(e.target.checked){
        let arr=dispatch
        arr.push(item.PO)
        setDispatch(arr)
      }

      else{
        let arr=dispatch
        arr = arr.filter(it => it !== item.PO)
        setDispatch(arr)
      }
      console.log(dispatch)
        
    }

  useEffect(()=>{
    callApi(setState)
  },[])


 useEffect(() => {
    if (state.response && state.response?.error?.includes("The access token expire")) {
      logout();
    }
  }, [state]);


  const logout = async () => {
    try {
      const response = await fetch('/api/auth/logout', {
        credentials: 'include',
      });
      if (response) {
        window.location.href = '/'; // Redirect to login page after logout
      }
    } catch (error) {
      console.error('Failed to logout:', error);
    }
  };



  console.log("/// state ////", state)
  console.log("/// user ////",user)
  // Debug useEffect
  useEffect(() => {
    if (editItem) {
      console.log('Current editItem:', editItem);
      console.log('Current customFields:', customFields);
    }
  }, [editItem, customFields]);

  return (
    user && (
      <>
        <div className="hero my-5 text-center flex items-center justify-center" data-testid="hero">
          {!isLoading ? (state.response && !state?.response?.error ? 
            <div>
              <table>
                <thead>
                  <tr>
                    <th>PO</th>
                    <th>Date</th>
                    <th>Zipcode</th>
                    <th>Price</th>
                    <th>Service</th>
                    <th className='driver-column'>Driver</th>
                    <th>Dispatch</th>
                    <th>PDF</th>
                    <th>Edit</th>
                  </tr>
                </thead>
                <tbody>
                  {state?.response?.map((item) => (
                //  {data.map((item) => (
                  <tr key={item.PO}>
                    <td><div className='font-semibold'>{item.PO}</div></td>
                    <td><div className=' text-base text-center'>{item.createdAT.split(",")[0]}</div></td>
                    <td><div className='font-semibold'>{extractZipCode(item.towFrom).at(-1)}</div></td>
                    <td>{item.price}</td>
                    <td className='text-sm'>{item.serviceType}</td>
                    <td className='text-sm driver-column-content'>{item.DriverName}</td>
                   {/* <td> 
                      <label className="custom-checkbox flex items-center justify-center">
                        <input type="checkbox" className='mt-2 ml-2' checked={item.update ? true :  false}  data-update-id={item.PO} onChange={(e) => handleCheckboxChange(e, item)}/>
                      </label>
                      </td> */}
                     <td className=''> 
                      <label className="custom-checkbox flex items-center justify-center text-center">
                        <input type="checkbox" className='mt-2 ml-2'  data-dispatch-id={item.PO} onChange={(e) => handleDispatchCheckboxChange(e, item)}    />
                      </label>
                    </td> 
                    <td data-pdf-id={item.PO} className=''></td>
                    <td>
                      <button 
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded"
                        onClick={() => {
                          setEditItem({...item});
                          setShowEditModal(true);
                        }}
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button disabled={state.response ? false : true} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded  outline outline-none focus:outline-none mt-9" onClick={async()=>{
              
                  let arr0=[]
                  for(let i=0;i<dispatch.length;i++){
                    arr0.push(state.response.filter(it=>it.PO==dispatch[i])[0])
                  }
                  console.log("%%%%$$$$ $$$$%%%%%",arr0)


                  for(let i=0;i<arr0.length;i++){

                    const dispatchId =arr0[i].PO ; // Replace with the actual ID you're looking for
                    const checkbox = document.querySelector(`input[type="checkbox"][data-dispatch-id="${dispatchId}"]`);
                    const checkboxPDF = document.querySelector(`td[data-pdf-id="${dispatchId}"]`);
                    
                    if (checkbox && !checkbox.disabled) {

                      let {id,...obj0}=arr0[i]
                

                    // await fetch('http://localhost:3000/api/dispatch', {
                    await fetch('/api/dispatch', {
                        method: 'POST',
                        headers: {
                          'Content-Type': 'application/json',
                        
                        },
                        body: JSON.stringify(obj0),
                      }).then(res=>{
                        res.json().then(response=>{
                            if(response.error){
                                alert(`${response.error} for this user`)
                            }
                            else{
                                console.log("$$$$$$ response $$$$$$",response)
                                if(response.callId){
                                  checkbox.parentElement.parentElement.classList.add("bg-green-500")
                                  checkbox.disabled=true
                                }
                                else{
                                  checkbox.parentElement.parentElement.classList.add("bg-red-500")
                                }

                                if(response.invoice?.msg){
                                  checkboxPDF.classList.add("bg-green-500")
                                }
                                else{
                                  checkboxPDF.classList.add("bg-red-500")
                                }
                            }
                        })
                    })     
                    }
                  }
        }}>
            Dispatch
        </button>

        <button disabled={state.response ? false : true} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 ml-4 rounded  outline outline-none focus:outline-none mt-9" onClick={async()=>{
             const response = await fetch('/api/sendEmail');
             let data=await response.json()
             let arr=data?.message?.split("\n")
             setFiles(parseJsonFromString(arr[0])?.file_names)
             console.log("$$$$$ from response $$$$$",arr,parseJsonFromString(arr[0]).file_names)

        }}>
          Send Email
        </button>
       
        <br/>
        <div className='pt-9'>
          {files?.length>1 ? <div className='font-bold text-slate-800'>Files sent via email</div> : null}
          {files?.map((item,index)=>{
            return <div className='text-slate-600 font-bold' key={item}>
                      <a>{index+1} - {item}</a>
                  </div>
          })}
        </div>
        <div>{sum}</div>
        </div> : (state.response ? <h1 className='text-gray-500'>Not authorized</h1> :  <h4>Loading...</h4>)) : <h4>Loading...</h4>}
        
      </div>

        {showEditModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto relative shadow-2xl">
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setEditItem(null);
                  setUpdateMessage('');
                }}
                className="absolute top-4 right-4 p-1 bg-white rounded-full hover:bg-gray-100 shadow-sm transition-all duration-200"
              >
                <XMarkIcon className="h-6 w-6 text-gray-900" />
              </button>

              <div className="p-8">
                <div className="mb-8">
                  <h3 className="text-2xl font-semibold text-gray-800 mb-1">Edit Item</h3>
                  <p className="text-sm text-gray-500">Update the information below</p>
                </div>

                {/* Basic Info */}
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Driver Name</label>
                    <input
                      type="text"
                      className="block w-full px-4 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-150 ease-in-out"
                      value={editItem?.DriverName || ''}
                      onChange={(e) => setEditItem({...editItem, DriverName: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">PO</label>
                    <input
                      type="text"
                      className="block w-full px-4 py-2.5 text-gray-500 bg-gray-50 border border-gray-200 rounded-lg cursor-not-allowed"
                      value={editItem?.PO || ''}
                      disabled
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Driver Towbook ID</label>
                    <input
                      type="number"
                      className="block w-full px-4 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-150 ease-in-out"
                      value={editItem?.driverIdTowbook || ''}
                      onChange={(e) => setEditItem({...editItem, driverIdTowbook: parseInt(e.target.value)})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Case PO</label>
                    <input
                      type="text"
                      className="block w-full px-4 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-150 ease-in-out"
                      value={editItem?.casePO || ''}
                      onChange={(e) => setEditItem({...editItem, casePO: e.target.value})}
                    />
                  </div>
                </div>

                {/* Service Info */}
                <div className="mt-8">
                  <h4 className="text-lg font-medium text-gray-800 mb-4">Service Information</h4>
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                      <input
                        type="number"
                        className="block w-full px-4 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-150 ease-in-out"
                        value={editItem?.price || ''}
                        onChange={(e) => setEditItem({...editItem, price: parseFloat(e.target.value)})}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Service Type</label>
                      <input
                        type="text"
                        className="block w-full px-4 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-150 ease-in-out"
                        value={editItem?.serviceType || ''}
                        onChange={(e) => setEditItem({...editItem, serviceType: e.target.value})}
                      />
                    </div>
                  </div>
                </div>

                {/* Location Info */}
                <div className="mt-8">
                  <h4 className="text-lg font-medium text-gray-800 mb-4">Location Details</h4>
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Tow From</label>
                      <input
                        type="text"
                        className="block w-full px-4 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-150 ease-in-out"
                        value={editItem?.towFrom || ''}
                        onChange={(e) => setEditItem({...editItem, towFrom: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Tow To</label>
                      <input
                        type="text"
                        className="block w-full px-4 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-150 ease-in-out"
                        value={editItem?.towTo || ''}
                        onChange={(e) => setEditItem({...editItem, towTo: e.target.value})}
                      />
                    </div>
                  </div>
                </div>

                {/* Vehicle Info */}
                <div className="mt-8">
                  <h4 className="text-lg font-medium text-gray-800 mb-4">Vehicle Information</h4>
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Color</label>
                      <input
                        type="text"
                        className="block w-full px-4 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-150 ease-in-out"
                        value={editItem?.vehicle?.color || ''}
                        onChange={(e) => setEditItem({
                          ...editItem,
                          vehicle: { ...editItem.vehicle, color: e.target.value }
                        })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Make</label>
                      <input
                        type="text"
                        className="block w-full px-4 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-150 ease-in-out"
                        value={editItem?.vehicle?.make || ''}
                        onChange={(e) => setEditItem({
                          ...editItem,
                          vehicle: { ...editItem.vehicle, make: e.target.value }
                        })}
                      />
                    </div>
                  </div>
                </div>

                {/* Custom Fields */}
                <div className="mt-8">
                  <h4 className="text-lg font-medium text-gray-800 mb-4">Custom Fields</h4>
                  <div className="space-y-4 bg-gray-50 p-6 rounded-lg">
                    {editItem && Object.entries(editItem).map(([key, value]) => {
                      const standardFields = ['id', 'PO', 'DriverName', 'casePO', 'completed', 'contact', 
                        'createdAT', 'dispached_date', 'driverIdTowbook', 'price', 'service', 'serviceType', 
                        'towFrom', 'towTo', 'vehicle', 'PdfCreatedAt', 'callId'];
                      
                      if (!standardFields.includes(key)) {
                        const fieldType = key === 'update' ? 'boolean' : (customFields[key]?.type || 'text');
                        return (
                          <div key={key} className="flex items-end gap-4 bg-white p-4 rounded-lg shadow-sm">
                            <div className="flex-1">
                              <label className="block text-sm font-medium text-gray-700 mb-1">{key}</label>
                              {fieldType === 'boolean' ? (
                                <select
                                  className="block w-full px-4 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-150 ease-in-out"
                                  value={value === null || value === undefined ? 'false' : value.toString()}
                                  onChange={(e) => {
                                    const updatedItem = {...editItem};
                                    updatedItem[key] = e.target.value === 'true';
                                    setEditItem(updatedItem);
                                  }}
                                >
                                  <option value="true">Yes</option>
                                  <option value="false">No</option>
                                </select>
                              ) : (
                                <input
                                  type={fieldType}
                                  className="block w-full px-4 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-150 ease-in-out"
                                  value={value}
                                  onChange={(e) => {
                                    const updatedItem = {...editItem};
                                    updatedItem[key] = fieldType === 'number' ? parseFloat(e.target.value) || 0 : e.target.value;
                                    setEditItem(updatedItem);
                                  }}
                                />
                              )}
                            </div>
                            <button
                              className="px-4 py-2.5 text-sm text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                              onClick={() => {
                                const updatedItem = {...editItem};
                                delete updatedItem[key];
                                const updatedCustomFields = {...customFields};
                                delete updatedCustomFields[key];
                                setCustomFields(updatedCustomFields);
                                setEditItem(updatedItem);
                              }}
                            >
                              Remove
                            </button>
                          </div>
                        );
                      }
                      return null;
                    })}
                  </div>
                </div>

                {/* Update Message */}
                {updateMessage && (
                  <div className={`mt-6 p-4 rounded-lg text-center ${
                    updateMessage.includes('successfully') 
                      ? 'bg-green-50 text-green-800 border border-green-200' 
                      : 'bg-red-50 text-red-800 border border-red-200'
                  }`}>
                    {updateMessage}
                  </div>
                )}

                {/* Action Buttons */}
                <div className="mt-8 border-t pt-6 flex justify-end space-x-4">
                  <button
                    className="px-6 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200 transition duration-150 ease-in-out"
                    onClick={() => {
                      setShowEditModal(false);
                      setEditItem(null);
                      setUpdateMessage('');
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    className="px-6 py-2.5 text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-150 ease-in-out"
                    onClick={async () => {
                      try {
                        console.log('Updating item:', editItem);
                        const response = await fetch('/api/updateItem?obj=' + encodeURIComponent(JSON.stringify(editItem)));
                        const data = await response.json();
                        
                        if (data.error) {
                          console.error('Server error:', data.error);
                          setUpdateMessage('Failed to update item: ' + data.error);
                          return;
                        }

                        setState(prevState => ({
                          ...prevState,
                          response: prevState.response.map(item =>
                            item.PO === editItem.PO ? editItem : item
                          ),
                        }));

                        setUpdateMessage('Item updated successfully!');

                        setTimeout(() => {
                          setUpdateMessage('');
                        }, 3000);
                      } catch (error) {
                        console.error('Error updating item:', error);
                        setUpdateMessage('Failed to update item. Please try again.');
                      }
                    }}
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </>
    )
  );
}

export default Hero;
