import React, { useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';

export default function Logger(props) {
  // const divRef = useRef(null);
  // useEffect(() => {
  //   divRef.current.scrollIntoView({ behavior: 'smooth' });
  // });
  let log = useSelector(state => state.log)
  const logArr = [];
  for (let i = log.length-1; i>=0; --i) {
    logArr.push(<li key = {i}>{log[i]}</li>)
  }
  /*
  Your code here
  */

  return (
    //feel free to change this however you'd like:
    <div className="drawer text" id="logger">
      <ul>{logArr}</ul>
    </div>
  );
}
