
export function showDialogue(node, onChoice) {
    const dialogueElement = document.getElementById("dialogue");
    const choicesElement = document.getElementById("choices");

    dialogueElement.textContent = node.dialogue ?? "";
    choicesElement.replaceChildren();

    const choices = node.choices ?? [];

    if (choices.length === 0) {
        const ending = document.createElement("p");
        ending.textContent = "The End.";

        const restart = document.createElement("button");
        restart.type = "button";
        restart.textContent = "Start again";
        restart.addEventListener("click", () => onChoice(null));

        choicesElement.append(ending, restart);
        return;
    }

    for (const choice of choices) {
        const button = document.createElement("button");
        button.type = "button";
        button.textContent = choice.text;

        button.addEventListener("click", () => {
            onChoice(choice.destinationNode);
        });

        choicesElement.append(button);
    }
}

export function clearDialogue() {
    document.getElementById("dialogue").textContent = "";
    document.getElementById("choices").replaceChildren();
}
