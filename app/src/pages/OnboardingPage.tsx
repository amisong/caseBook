import { useAddProject } from '../components/AddProject'
import { Button } from '../components/Button'
import { ArtApprove, ArtPins, ArtRequest, ArtVersions } from '../components/OnboardingArt'

const STEPS = [
  { art: <ArtRequest />, title: 'Get a request or add a project', text: '' },
  { art: <ArtVersions />, title: 'AI finds every version', text: 'AI reads the code and shows each version of the screen for each type of user.' },
  { art: <ArtPins />, title: 'Leave pins and comments', text: 'Click on the design and write what the developer needs to fix.' },
  { art: <ArtApprove />, title: 'Check again and approve', text: 'The developer fixes it. Then check the changes and approve.' },
]

/** The first page. It explains how the tool works in four cards. */
export function OnboardingPage() {
  const openAddProject = useAddProject()
  return (
    <div className="welcome">
      <h1 className="display">Check every screen before it ships</h1>
      <p className="start-text">
        See every version of a screen, tell the developer what to fix, and approve it.
      </p>

      <ol className="cards">
        {STEPS.map((step, index) => (
          <li key={step.title} className="card-step">
            <div className="card-art">{step.art}</div>
            <p className="card-title">
              {index + 1}. {step.title}
            </p>
            {step.text ? <p className="card-text">{step.text}</p> : null}
            {index === 0 ? (
              <Button size="small" variant="primary" className="card-action" onClick={openAddProject}>
                Add project
              </Button>
            ) : null}
          </li>
        ))}
      </ol>

    </div>
  )
}
