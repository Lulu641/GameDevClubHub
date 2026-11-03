import { Link } from 'react-router'
import Icon, { BrandMark } from '../components/Icon.jsx'

function About() {
  return (
    <div className="about-page">
      <section className="about-hero" aria-labelledby="about-title">
        <div className="about-hero-copy">
          <p className="eyebrow">ABOUT JAMTRACK</p>
          <h1 id="about-title">Less juggling.<br /><span>More game-making.</span></h1>
          <p className="hero-description">Big ideas are exciting. Finishing them takes small steps. JamTrack gives your game development work a clear next move.</p>
          <div className="hero-actions">
            <Link className="button button-primary" to="/tasks">Open your task board <Icon name="arrow" /></Link>
            <a className="text-link" href="#how-it-works">See how it works <span aria-hidden="true">↘</span></a>
          </div>
        </div>
        <div className="build-loop" role="img" aria-label="The game development loop: plan, build, play">
          <div className="loop-topline"><span>THE BUILD LOOP</span><BrandMark /></div>
          <div className="loop-orbit" aria-hidden="true"><span className="orbit-dot" /><div className="orbit-center"><Icon name="play" size={42} /></div></div>
          <div className="loop-stages"><span><i>01</i> Plan it.</span><span><i>02</i> Build it.</span><span><i>03</i> Play it.</span></div>
          <p>Small steps. Real progress.</p>
        </div>
      </section>

      <section className="about-values" aria-label="Why JamTrack">
        <article><span className="feature-icon"><Icon name="flag" /></span><h2>Start small.</h2><p>Turn a big game idea into one clear task. Add a note and an effort estimate to give it shape.</p></article>
        <article><span className="feature-icon"><Icon name="bolt" /></span><h2>See the momentum.</h2><p>Completed work, remaining tasks, and effort totals come together in one simple view.</p></article>
        <article><span className="feature-icon"><Icon name="folder" /></span><h2>Pick it up later.</h2><p>Your saved tasks stay with your project, so you can come back and keep building.</p></article>
      </section>

      <section className="how-section" id="how-it-works" aria-labelledby="how-heading">
        <div className="section-intro"><p className="eyebrow">A SIMPLE WAY TO KEEP GOING</p><h2 id="how-heading">From idea to<br />your next playable build.</h2><p>A little structure leaves more room for the creative part.</p></div>
        <ol className="how-steps">
          <li><span className="step-number">01</span><div><h3>Capture your next step</h3><p>Add a title, an optional description, and a rough effort estimate on the Tasks page.</p></div></li>
          <li><span className="step-number">02</span><div><h3>Build it. Check it off.</h3><p>Mark a task complete when it is ready. Reopen it whenever something needs another pass.</p></div></li>
          <li><span className="step-number">03</span><div><h3>Check the bigger picture</h3><p>Open Dashboard to see your saved work and how much of it is complete.</p></div></li>
        </ol>
      </section>

      <section className="about-origin" aria-labelledby="origin-heading">
        <div><p className="eyebrow">WHERE IT STARTED</p><h2 id="origin-heading">A club idea.<br />A place to make progress.</h2><p>JamTrack grew out of GameDevClubHub, a Code2College capstone project for organizing game development work. Its purpose stays simple: help game makers turn ideas into finished steps.</p></div>
        <aside className="saving-note"><Icon name="folder" size={26} /><h3>A note on your saved work</h3><p>Tasks save when you add, complete, reopen, or remove them. Your saved work belongs to this running project. Keep its data folder when moving the app.</p></aside>
      </section>

      <section className="about-cta"><div><p className="eyebrow">YOUR NEXT BUILD IS WAITING</p><h2>One task closer.</h2></div><Link className="button button-dark" to="/tasks">Go to your tasks <Icon name="arrow" /></Link></section>
    </div>
  )
}

export default About
