import React, { useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';

export default function Logger(props) {
  const log = useSelector(state => state.log)
  
  useEffect(() => {
    const drawer = document.querySelector('#logger');
    drawer.scrollTop = drawer.scrollHeight;
  })
  
  const turnHistory = log.map((el,i) => {
    return <li key = {i}>{el}</li>
  })

  return (
    //feel free to change this however you'd like:
    <div className="drawer text" id="logger">
      <ul>{turnHistory}</ul>
    </div>
  );
}
