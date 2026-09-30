import { useState } from 'react'

const Button = ({handleClick , text}) => {
  return <button onClick={handleClick}>{text}</button>
}

const Statistics = ({good, neutral, bad}) => {
  const sum = () => good + neutral + bad;
  const average = () => (good - bad) / sum();
  const positive = () => good / sum();

  return (
    <>
      <div>Good {good}</div>
      <div>Neutral {neutral}</div>
      <div>Bad {bad}</div>
      <div>All {sum()}</div>
      <div>Average {average()}</div>
      <div>Positive {positive() * 100} %</div>
    </>
  )
}

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const handleIncreaseFeedback = (stateFn) => {
    stateFn(prev => prev + 1);
  }

  const hasFeedback = good + neutral + bad > 0;

  return (
    <div>
      <h1>Give Feedback</h1>
      <Button handleClick={() => handleIncreaseFeedback(setGood)} text="good"></Button>
      <Button handleClick={() => handleIncreaseFeedback(setNeutral)} text="neutral"></Button>
      <Button handleClick={() => handleIncreaseFeedback(setBad)} text="bad"></Button>

      <h2>Statistics</h2>

      {
        hasFeedback 
          ? <Statistics good={good} neutral={neutral} bad={bad} />
          : "No Feedback Given"
      }
      
    </div>
  )
}

export default App