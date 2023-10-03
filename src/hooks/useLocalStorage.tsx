import {useEffect, useState} from 'react'
export default function useLocalStorage<T>(key: string, initialValue:T | (()=> T)){
  const [value, setValue] = useState<T>(
    ()=>{
      const storedData = window.localStorage.getItem(key)
      if(storedData === null){
        if(typeof initialValue === 'function'){
          return (initialValue as ()=>T)()
        }else{
          return initialValue
        }
      }else{
        return JSON.parse(storedData)
      }
    }
  )
  useEffect(() => {
    localStorage.setItem(key,JSON.stringify(value))
    console.log('deep update')
  }, [value, key])
  
  return [value,setValue] as [T, typeof setValue]
}