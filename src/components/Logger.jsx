import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';

export default function Logger() {
  let log = useSelector(state => state.log)
  let turnHistory = [...log]

  useEffect(() => {
    const drawer = document.querySelector('.drawer');
    drawer.scrollTop = drawer.scrollHeight;
  })
  
  if (turnHistory.length > 20) {
      turnHistory = turnHistory.slice(Math.max(turnHistory.length - 20, 0))
    }
  turnHistory = turnHistory.map((listItem, i) => {
    return <li key = {i}>{listItem}</li>
  })

  return (
    //feel free to change this however you'd like:
    <div className="drawer text" id="logger">
      <ul>{turnHistory}</ul>
    </div>
  );
  }
