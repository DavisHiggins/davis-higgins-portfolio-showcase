// Optimized logo derivatives (scripts/build-media.mjs → src/assets/opt).
import dhMark from '../assets/opt/dh-mark.webp'
import kewaunee from '../assets/opt/kewaunee.webp'
import higginsDigital from '../assets/opt/higgins-digital.webp'
import pdt from '../assets/opt/pdt.webp'
import hbg from '../assets/opt/hbg.webp'
import tus from '../assets/opt/tus.webp'
import lakeside from '../assets/opt/lakeside.webp'
import oneChaptr from '../assets/opt/one-chaptr.webp'
import teesly from '../assets/opt/teesly.webp'
import uncc from '../assets/opt/uncc.webp'
import cvcc from '../assets/opt/cvcc.webp'
import projectCade from '../assets/opt/project-cade.webp'
import projectContender from '../assets/opt/project-contender.webp'
import projectFlowcast from '../assets/opt/project-flowcast.webp'
import projectDhlm from '../assets/opt/project-dhlm.webp'
import projectHigginsDigital from '../assets/opt/project-higgins-digital.webp'
import projectProspectIq from '../assets/opt/project-prospectiq.webp'
import projectCrowncode from '../assets/opt/project-crowncode.webp'
import projectCuratedNotes from '../assets/opt/project-curated-notes.webp'

export const DH_MARK = dhMark
export const UNCC_LOGO = uncc
export const CVCC_LOGO = cvcc

export const EMPLOYER_LOGOS: Record<string, string> = {
  'one-chaptr': oneChaptr,
  kewaunee,
  'higgins-digital': higginsDigital,
  lakeside,
  pdt,
  hbg,
  teesly,
  tus,
}

/** Existing project marks, shown as a secondary identity element on case studies. */
export const PROJECT_LOGOS: Record<string, { src: string; wide?: boolean }> = {
  cade: { src: projectCade, wide: true },
  contender: { src: projectContender },
  flowcast: { src: projectFlowcast, wide: true },
  dhlm: { src: projectDhlm },
  'higgins-digital': { src: projectHigginsDigital },
  prospectiq: { src: projectProspectIq },
  'crowncode-ai': { src: projectCrowncode },
  'curated-notes': { src: projectCuratedNotes },
  'kewaunee-analytics': { src: kewaunee },
  'lakeside-sport-club': { src: lakeside },
  'higgins-building-group': { src: hbg },
}
