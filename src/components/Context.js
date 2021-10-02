import React, { useState, useContext, useEffect } from "react";
import LabGroupDataService from "../service/lab-group-http"
import CourseDataService from "../service/course-http"

const AppContext = React.createContext();

const AppProvider = ({ children }) => {

  const useLocalStorage = () => {
    try{
      const labGroups = window.localStorage.getItem('lab_groups')
      return JSON.parse(labGroups)
    }
    catch(e){
      return []
    }
  }

  const [globalLabGroups, setGlobalLabGroups] = useState(useLocalStorage())

  useEffect(() => {
    const fetchLabGroups = async () => {
      let response1 = await LabGroupDataService.getLabGroups()
      let response2 = await CourseDataService.getCourses()
  
      let newList = []
  
      response1.data.forEach(({id , lab_group_name, course}) => {
        let lab_group_id = id
        response2.data.forEach(({id, course_code, course_name}) => {
          let course_id = id
          if(course_id === course){
            let newObj = {lab_group_id, course_name, course_code, lab_group_name,course_id}
            newList.push(newObj)
          }
        })
        setGlobalLabGroups([...newList])
        window.localStorage.setItem('lab_groups', JSON.stringify(newList))
      })
    }
    if(!globalLabGroups){
      fetchLabGroups()
    }
}, [globalLabGroups]);
  
  return (
    <AppContext.Provider
      value={{
        globalLabGroups,
        setGlobalLabGroups
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useGlobalContext = () => {
  return useContext(AppContext);
};


export { AppContext, AppProvider };
