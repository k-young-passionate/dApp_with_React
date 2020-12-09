import './App.css';
import React, {useState} from 'react';
import {ethers} from 'ethers';

const abi = require('./functions/abi.json');

let contract = undefined;
let signed_contract = undefined;


function App() {
  const [candidate, setCandidate] = useState([]);
  const [selected, setSelected] = useState('');
  const [voted, setVoted] = useState(false);
  const [voteCount, setVoteCount] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [contractAddr, setContractAddr] = useState('');
  const [contract_addr, setContract_addr] = useState('');
  
  if(!contract_addr){
    return (
      <div className="App">
        <header className="App-header">
          <input class='button' type='text' value={contractAddr} onChange={(event)=>{
            setContractAddr(event.target.value);
          }}></input>
          <button class='button' type='submit' onClick={()=>{
            setContract_addr(contractAddr);
          }}>주소 입력</button>
        </header>
      </div>
    );
  } else {
    if(!isLoaded) {
      try{
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        contract = new ethers.Contract(contract_addr, abi, provider);
        signed_contract = contract.connect(signer);
        // ethereum.autoRefreshOnNetworkChange = false
        window.ethereum.enable();
        setIsLoaded(true);
      } catch (err){
        alert("wrong contract address");
        setContract_addr('');
      }
      
    }
  
    const getCandidates = () => {
      contract.getCandidates().then((result) => {
        setCandidate(result);
      })
    }
  
    const getVoteCounts = () => {
      contract.getVoteCount().then((result) => {
        let resultList = Array();
        result.map(bigNum => {
          const value = Number(bigNum);
          resultList.push(value);
        })
        setVoteCount(resultList);
      }).catch(
        err => {
          const tmpErrmsg = err['message'].split(":");
          const errMsg = tmpErrmsg[tmpErrmsg.findIndex(element => element === '"execution reverted') + 1].split(',')[0].slice(0, -1);
          alert(errMsg);
        }
      )
    }
  
    const voteSelected = (index) => {
      signed_contract.vote(index).then((err, result) => {
        if (err){
        } else {
          setVoted(result);
        }
      }).catch(
        err => {
          const tmpErrmsg = err['message'].split(":");
          const errMsg = tmpErrmsg[tmpErrmsg.findIndex(element => element === '"execution reverted') + 1].split(',')[0].slice(0, -1);
          alert(errMsg);
        }
      )
    }
  
    const finishVote = () => {
      try{
        signed_contract.endVote().then((result)=>{
          console.log(result);
        }).catch(
          err => {
            const tmpErrmsg = err['message'].split(":");
            const errMsg = tmpErrmsg[tmpErrmsg.findIndex(element => element === '"execution reverted') + 1].split(',')[0].slice(0, -1);
            alert(errMsg);
          }
        )
      } catch(err){
        console.log(err);
      }
    }
  
    const changeRadio = (e) => {
      setSelected(e.target.id);
    };
    
    return (
      <div className="App">
            <header className="App-header">
            <button class='button' onClick={() => {getCandidates()}}>candidate</button>
            { candidate.length ? (
              <button class='button' onClick={() => {finishVote()}}>Finish Vote</button>
            ) : (
              null
            )}
            <button class='button' onClick={() => {getVoteCounts()}}>show Result</button>
            {
              voteCount.length ? (
                <table>
              <tr>
                {voteCount.map((value, index)=>{
                  return (
                    <td>{value}</td>
                  );
                })}
              </tr>
              <tr>
                {
                  candidate.map((value, index) => {
                    return (
                      <td>{value}</td>
                    );
                  })
                }
              </tr>
            </table>
              ) : (
                null
              )
            }
            
            
            <ul>
              <div className="edit">
                <p>Produce 404: 당신의 개발자는?</p>
                {
                  candidate.map((value, index) => {
                    return (
                      <p style={{alignItems:'start'}}>
                      <label htmlFor={value}>
                        <input
                          type="radio"
                          id={index}
                          name={value}
                          value={value}
                          checked={selected === index.toString() ? true : false}
                          onChange={changeRadio}
                        ></input>
                        {value}
                      </label>
                      </p>
                    );
                  })
                }
              </div>
              <div>
                {candidate.length ? <button class='button' type='submit' onClick={() => {
                  voteSelected(Number(selected));
                }}>vote</button> : null}
              </div>
            </ul>
            
          </header>
      </div>
    );
  }

  
  
}

export default App;
