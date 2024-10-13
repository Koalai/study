import { useState } from 'react';
import Content from './components/Content';
import Header from './components/Header';
import Total from './components/Total';

function App() {
  /*  Exercise1
  const course = {
    name: 'Half Stack application development',
    parts: [
      {
        name: 'Fundamentals of React',
        exercises: 10,
      },
      {
        name: 'Using props to pass data',
        exercises: 7,
      },
      {
        name: 'State of a component',
        exercises: 14,
      },
    ],
  };

  return (
    <>
      <Header course={course} />
      <Content course={course} />
      <Total course={course} />
    </>
  );
  */

  /* Exercise 2
  const [good, setGood] = useState(0);
  const [neutral, setNeutral] = useState(0);
  const [bad, setBad] = useState(0);

  const increment = (setter) => {
    setter((prev) => prev + 1);
  };
  return (
    <>
      <h1 className='font-black text-xl'>Give feedback</h1>
      <div className='flex gap-4'>
        <Buttons text='Good' increment={() => increment(setGood)} />
        <Buttons text='Neutral' increment={() => increment(setNeutral)} />
        <Buttons text='Bad' increment={() => increment(setBad)} />
      </div>
      <h1 className='font-black text-xl'>Statistics</h1>
      <table>
        <tbody>
          <Statistics text='Good' value={good} />
          <Statistics text='Neutral' value={neutral} />
          <Statistics text='Bad' value={bad} />
          <Statistics text='Total' value={good + neutral + bad} />
          <Statistics
            text='Average Score'
            value={
              good + neutral + bad > 0
                ? (good - bad) / (good + neutral + bad)
                : 0
            }
          />
          <Statistics
            text='Positive'
            value={
              good + neutral + bad > 0
                ? (good / (good + neutral + bad)) * 100
                : 0
            }
          />
        </tbody>
      </table>
    </>
  );
}


const Statistics = ({ text, value }) => {
  return (
    <tr>
      <td>{text}</td>
      <td>{value}</td>
    </tr>
  );
};

const Buttons = ({ text, increment }) => {
  return (
    <>
      <button className='bg-slate-200 rounded-md px-2 py-1' onClick={increment}>
        {text}
      </button>
    </>
  );
  */

  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.',
    'The only way to go fast, is to go well.',
  ];

  const [selected, setSelected] = useState(0);
  const [votes, setVotes] = useState(Array(anecdotes.length).fill(0));

  const randomIndex = () => {
    let random;
    do {
      random = Math.floor(Math.random() * anecdotes.length);
    } while (random === selected);
    setSelected(random);
  };

  const increment = () => {
    const newVotes = [...votes];
    newVotes[selected] += 1;
    setVotes(newVotes);
  };

  const mostVotedIndex = votes.indexOf(Math.max(...votes));

  return (
    <>
      <p>{anecdotes[selected]}</p>
      <p>Has {votes[selected]} vote</p>
      <div className='flex gap-4'>
        <button
          onClick={increment}
          className='bg-slate-200 px-2 py-1 rounded-md'
        >
          Vote
        </button>
        <button
          onClick={randomIndex}
          className='bg-slate-200 px-2 py-1 rounded-md'
        >
          Next anecdotes
        </button>
      </div>
      <div>
        <p>{anecdotes[mostVotedIndex]}</p>
        <p>Has {votes[mostVotedIndex]} votes </p>
      </div>
    </>
  );
}

export default App;
