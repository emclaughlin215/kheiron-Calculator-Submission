import { Button, H2, InputGroup, Intent, MenuItem } from '@blueprintjs/core';
import { Select } from '@blueprintjs/select';
import React from 'react';
import './App.scss';
import { Calculator } from './calculator/calculator';
import { filterMode, IMode, renderMode } from './SelectUtils'; 

interface AppState {
  input: string;
  currentMode: string;
  calc: Calculator;
  output?: number;
  errorMessage?: string;
}

class App extends React.PureComponent<{}, AppState> {
  constructor() {
    super({});
    this.state = {
      input: '',
      currentMode: 'Prefix',
      calc: new Calculator(),
    }
  } 
 
  private calculatorModes: IMode[] = [
    {
      type: 'prefix',
      display: 'Prefix',
    },
    {
      type: 'infix',
      display: 'Infix',
    }
  ] 

  render() {
    
    const ModeSelect = Select.ofType<IMode>(); 

    const handleModeChange = (mode: IMode): void => {
      try {
        this.state.calc.setMode(mode.type)
        this.setState({ currentMode: mode.display })
      } catch(errorMessage: any) {
        this.setState({ errorMessage, currentMode: mode.display })
      }
    }
  
    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
      const input: string = event.target.value;
      this.setState({ input })
    }

    const calculate = (): void => {
      let resultant: number;
      try {
        resultant = this.state.calc.calculate(this.state.input);
        this.setState({ output: resultant })
      } catch (errorMessage) {
        this.setState({ errorMessage })
      }
    }

    const initialContent = <MenuItem disabled={true} text={`${this.calculatorModes.length} items loaded.`} />;

    return (
      <div className="App bp3-dark">
        <header className="App-header">
          <p>
            Welcome to the Kheiron Online Calculator Task.
          </p>
        </header>
        <div className='Calculator'>
          <ModeSelect
            items={this.calculatorModes}
            initialContent={initialContent}
            noResults={<MenuItem disabled={true} text="No results." />}
            onItemSelect={(mode: IMode) => handleModeChange(mode)}
            itemPredicate={filterMode}
            itemRenderer={renderMode}>
              <Button
                rightIcon="caret-down"
                text={this.state.currentMode}
                disabled={false}
              />
            </ModeSelect>
          <InputGroup
            className='Input'
            asyncControl={true}
            disabled={false} 
            large={true}
            onInputCapture={handleInputChange}
            placeholder="Input..."
          />
        <Button onClick={calculate} disabled={this.state.input === ''} intent={Intent.PRIMARY}>Calculate</Button>
        </div>  
        <div className='Answer'>{this.state.output}</div>
        {this.state.errorMessage}
      </div>
    );
  }

}

export default App;
