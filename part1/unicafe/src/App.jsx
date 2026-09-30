import { useState } from 'react'

const Button = ({handleClick , text}) => {
  return <button onClick={handleClick}>{text}</button>
}

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const handleIncreaseFeedback = (stateFn) => {
    stateFn(prev => prev + 1);
  }

  const sum = () => good + neutral + bad;
  const average = () => sum() === 0 ? 0 : (good - bad) / sum();
  const positive = () => sum() === 0 ? 0 : good / sum();

  return (
    <div>
      <h1>Give Feedback</h1>
      <Button handleClick={() => handleIncreaseFeedback(setGood)} text="good"></Button>
      <Button handleClick={() => handleIncreaseFeedback(setNeutral)} text="neutral"></Button>
      <Button handleClick={() => handleIncreaseFeedback(setBad)} text="bad"></Button>

      <h2>Statistics</h2>

      <div>Good {good}</div>
      <div>Neutral {neutral}</div>
      <div>Bad {bad}</div>
      <div>All {sum()}</div>
      <div>Average {average()}</div>
      <div>Positive {positive() * 100} %</div>
      
    </div>
  )
}

export default App