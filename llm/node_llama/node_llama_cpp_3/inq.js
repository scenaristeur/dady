import inquirer from 'inquirer'

// Clear the screen
process.stdout.write('\u001b[2J\u001b[0;0H')

const showMenu = () => {
  const questions = [
    {
      type: 'list',
      name: 'action',
      message: 'What do you want to do?',
      choices: [
        { name: 'action 1', value: 'Action1' },
        { name: 'action 2', value: 'Action2' },
        { name: 'Exit program', value: 'quit' }
      ]
    }
  ]
  return inquirer.prompt(questions)
}

const main = async () => {
  let loop = true
  while (loop) {
    await showMenu().then((answers) => {
      console.log(answers)
      if (answers.action == 'quit') {
        console.log('save & exit')
        loop = false
        // process.exit(0)
      } else {
        console.log('continue')
      }
    })
  }
}

main()
