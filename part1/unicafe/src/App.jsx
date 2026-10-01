import { useState } from 'react'

const Button = ({handleClick , text}) => {
  return <button onClick={handleClick}>{text}</button>
}

const StatisticLine = ({text, value}) => {
  return (
    <tr><td>{text}</td><td>{value}</td></tr>
  )
}

const Statistics = ({good, neutral, bad}) => {
  const sum = () => good + neutral + bad;
  const average = () => (good - bad) / sum();
  const positive = () => good / sum();

  return (
    <table>
      <tbody>
        <StatisticLine text="Good" value={good} />
        <StatisticLine text="Neutral" value={neutral} />
        <StatisticLine text="Bad" value={bad} />
        <StatisticLine text="All" value={sum()} />
        <StatisticLine text="Average" value={average()} />
        <StatisticLine text="Positive" value={positive() * 100 + " %"} />
      </tbody>
    </table>
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