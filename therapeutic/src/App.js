import { useEffect, useState, useRef } from "react";
import randomWords from "random-words"
const NUMBER_OF_WORDS = 200
const SECONDS = 60
 
function App() {
  const [words, setWords] = useState([])
  const [countDown, setCountDown] = useState(SECONDS)
  const [currInput, SetCurrInput] = useState('')
  const [currWordIndex, setCurrWordIndex] = useState(0)
  const [currCharIndex, setCurrCharIndex] = useState(-1)
  const [currChar, setCurrChar] = useState('')
  const [correct, setCorrect] = useState(0)
  const [incorrect, setIncorrect] = useState(0)
  const [status, setStatus] = useState('waiting')
  const textInput = useRef(null)
  useEffect(() => {
      setWords(generateWords())
    }, [])

    useEffect(() => {
      if(status === "started")
      textInput.current.focus()
    }, [status])
// this will apply focus on the input field
    function generateWords() {
      return new Array(NUMBER_OF_WORDS).fill(null).map(() => randomWords())
    }

    // function start() {
    // 
    //     
    //   }
      function start() {
        if(status === 'finished') {
          setWords(generateWords())
          setCurrWordIndex(0)
          setCorrect(0)
          setIncorrect(0)
          setCurrCharIndex(-1)
          setCurrChar("")

        }
        if(status !== "started") {
        setStatus('started')
        let interval = setInterval(() => {
          setCountDown((prevCountDown) => {
          if(prevCountDown === 0) {
            clearInterval(interval)
            setStatus('finished')
            SetCurrInput("")
            return SECONDS
            // need to return seconds from setCountDown
          } else {
          return prevCountDown - 1
          }
        } ) 
        }, 1000)
      }

    }

    function handleKeyDown({keyCode, key}) {
      
      // spacebar function
      
     if(keyCode === 32) {
      checkMatch()
      SetCurrInput('')
      setCurrWordIndex(currWordIndex + 1)
      setCurrCharIndex(-1)
      // backspace function
     } else if(keyCode === 8) {
      setCurrCharIndex(currCharIndex-1)
      setCurrChar("")
     } else {
      setCurrCharIndex(currCharIndex +1)
      setCurrChar(key)
     }
    }

    function checkMatch() {
      const wordToCompare = words[currWordIndex]
      const doesItMatch = wordToCompare === currInput.trim()
      if(doesItMatch) {
        setCorrect(correct + 1 )
      } else {
        setIncorrect(incorrect + 1)
      }
    }

    function getCharClass(wordIdx, charIdx, char) {
      if(wordIdx === currWordIndex && charIdx === currCharIndex && currChar && status !== 'finished')
        if(char === currChar){
        return 'has-background-success'
        } else {
          return 'has-background-danger'
        } else if(wordIdx === currWordIndex && currCharIndex >= words[currWordIndex].length) {
          return 'has-background-danger'
        }
       
       
        else {
        return ''
      } 

    }

  return (
    <div className="content is-centered App has-background-info">
      <h1>Calcualted Typing</h1>
      <div className="section is large">
        <div className="is-size-1 has-text-centered has-text-primary">
          <h2>{countDown}</h2>
        </div>
      </div>
      <div className="control is-expanded section">
        <input class="is-primary" ref= {textInput} disabled={status !== "started"} type="text" className="input" onKeyDown={handleKeyDown} value={currInput} onChange={(e) => SetCurrInput(e.target.value)} />
      </div>
      <div className="section">
        <button className="button is-success is-rounded is-fullwidth" onClick={start}> START</button>
      </div>
          {status === "started" && (
            <div className="section has-background-success">
              <div className="card">
                <div className="card-content">
                  <div className="content">
                    {words.map((word, i) => (
                      <span key={i}>
                      <span>
                        {word.split('').map((char, idx) => (
                          <span className={getCharClass(i, idx, char)} key={idx}>{char}</span>
                        ))}
                      </span>
                      <span> </span>
                      </span>
                    ))}

                  </div>
                </div>
              </div>
            </div>
          )}
          {status === "finished" && (
            <div className="section">
            <div className="columns">
            <div className="column has-text-centered">
            <p className="is-size-5">Words Per Minute:</p>
            <p className="has-text-primary is-size-1">
              {correct}
            </p>
          </div>
          <div className="column has-text-centered">
            <div className="is-size-5">Accuracy:</div>
            <p className="has-text-info is-size-1">
              {Math.round((correct / (correct + incorrect)) * 100)} %
            </p>
          </div>
        </div>
     </div>
            
          )}
        
   </div>
  );
}
export default App;
