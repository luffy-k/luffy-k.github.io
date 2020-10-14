import React from "react";
import ReactDOM from "react-dom";
import "./index.css";

function Square(props) {
  return (
    <button className={`square ${props.highlight ? "highlight" : ""}`} onClick={props.onClick}>
      {props.value}
    </button>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return {
        winner: squares[a],
        lines: lines[i]
      }
    }
  }
  return null;
}

class Board extends React.Component {
  renderSquare(i) {
    const { lines } = this.props;
    return (
      <Square
        key={i}
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
        highlight={lines && lines.includes(i)}
      />
    );
  }

  render() {
    const rowArray = [0, 3, 6];
    const temp = Array(3).fill(null);
    return (
      <div>
        {rowArray.map((v) => (
          <div key={v} className="board-row">
            {temp.map((t, i) => i + v).map((t) => this.renderSquare(t))}
          </div>
        ))}
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [
        {
          squares: Array(9).fill(null),
          idx: null,
        },
      ],
      stepNumber: 0,
      xIsNext: true,
      isReverse: false,
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? "X" : "O";
    this.setState({
      history: history.concat([
        { squares, idx: [(i % 3) + 1, Math.floor(i / 3) + 1] },
      ]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: step % 2 === 0,
    });
  }

  render() {
    const { history, xIsNext, stepNumber, isReverse } = this.state;
    const current = history[stepNumber];
    const result = calculateWinner(current.squares);
    const moves = history.map((step, move) => {
      const desc = step.idx
        ? `Go to move #${move} (${step.idx.join(",")})`
        : `Go to game start`;
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)} style={{fontWeight:(move === stepNumber)?700:400}}>{desc}</button>
        </li>
      );
    });

    let status;
    let winner, lines;
    if(result){
      winner = result.winner;
      lines = result.lines;
    }
    if (winner) {
      status = `Winner: ${winner} !`;
    } else if (stepNumber === 9) {
      status = `Game draw !!!`;
    } else {
      status = "Next player: " + (xIsNext ? "X" : "O");
    }
    let btnText;
    if(isReverse){
      btnText = `正序`;
      moves.reverse();
    }else{
      btnText = `倒序`;
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
            lines={lines}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <div>
            <button onClick={() => this.setState({ isReverse: !isReverse })}>{btnText}</button>
          </div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(<Game />, document.getElementById("root"));
