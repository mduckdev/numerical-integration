import { useEffect, useState } from "react";
import "../App.css"
import { Parser } from "expr-eval";
enum SourceEnum {
    "Equation",
    "lowerBound",
    "upperBound",
    "step"
}
const parser = new Parser();
const Panel = () => {
    const [upperBound, setUpperBound] = useState("");
    const [lowerBound, setLowerBound] = useState("");
    const [Equation, setEquation] = useState("");
    const [latexEquation, setLatexEquation] = useState("\\int_{}^{}xdx");
    const [step, setStep] = useState<number | null>(null);
    const handleInput = (e: React.ChangeEvent<HTMLInputElement>, source: SourceEnum) => {
        if (source === SourceEnum.Equation) setEquation(e.target.value);
        if (source === SourceEnum.lowerBound) setLowerBound(e.target.value);
        if (source === SourceEnum.upperBound) setUpperBound(e.target.value);
        if (source === SourceEnum.step) setStep(Number(e.target.value));

    }

    useEffect(() => {


        setLatexEquation(`\\int_{${lowerBound}}^{${upperBound}}${Equation} dx`)
    }, [upperBound, lowerBound, Equation]);

    const calculate = () => {
        if (upperBound !== "" && lowerBound !== "" && Equation !== "" && step !== null) {
            try {
                const expression = parser.parse(Equation);
                console.log(expression.evaluate({ x: lowerBound }));

                let increase = (Number(upperBound) - Number(lowerBound)) / step
                let iteration = Number(lowerBound) + increase;
                let sum = 0;
                sum += Number(expression.evaluate({ x: lowerBound }));
                for (iteration; iteration < Number(upperBound); iteration += increase) {
                    sum += 2 * Number(expression.evaluate({ x: iteration }))
                }
                sum += Number(expression.evaluate({ x: iteration }));
                sum *= increase / 2;

                console.log(sum);
            } catch (e) {
                console.log(e);
            }
        }
    }

    return (
        <div className="appContainer">
            <div className="equation">
                {latexEquation}
            </div>
            <div className="inputs">
                <input type="text" placeholder="Granica górna" onChange={e => handleInput(e, SourceEnum.upperBound)} ></input>
                <input type="text" placeholder="Granica dolna" onChange={e => handleInput(e, SourceEnum.lowerBound)}></input>
                <input type="number" placeholder="Krok" onChange={e => handleInput(e, SourceEnum.step)}></input>
                <input type="text" placeholder="Wzór" onChange={e => handleInput(e, SourceEnum.Equation)} value={Equation}></input>
                <button onClick={calculate} className="calculateButton">Oblicz</button>
            </div>
        </div>
    )
}
export default Panel;