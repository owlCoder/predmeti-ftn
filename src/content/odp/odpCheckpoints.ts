import type { Checkpoint } from '../checkpoints'

export const odpCheckpoints: Checkpoint[] = [
  {
    id: 'odp-p1',
    code: 'P1',
    title: 'Osnovni entiteti, ugovori i simulator',
    exercise: 'Vežba 1–2',
    date: '10.02.',
    summary:
      'Ne očekuje se završen distribuirani sistem. Tim treba da pokaže da razume osnovne entitete (misija, stanica, station node), da poseduje ponovljiv simulator i da su prvi ugovori (telemetrijska schema, katalog komandi) stabilni.',
    items: [
      'Zajednički repozitorijum sa README dokumentom, dodeljenom projektnom celinom i pristupom svih članova tima.',
      'Mission/GroundStation/StationNode implementirani sa osnovnim statusima i heartbeat proverom.',
      'Ponovljiv DeviceSimulator sa najmanje dva profila ponašanja (normalan i sa greškom).',
      'Najmanje jedan pull request pokazuje pregled diff-a i smislen razgovor o promeni.',
    ],
  },
  {
    id: 'odp-p2',
    code: 'P2',
    title: 'Identitet, audit, observability i konfiguracija',
    exercise: 'Vežba 3–4',
    date: '10.03.',
    summary:
      'Tim treba da pokaže da su poprečni mehanizmi sistema (ovlašćenja, audit, observability, referentna konfiguracija) stabilni pre nego što se na njih oslone operativni tokovi, i da su message contract registry i failure simulator spremni.',
    items: [
      'Provera dozvole zahteva i ulogu i pripadnost misiji (MissionMembership).',
      'Audit evidencija je append-only i pretraživa po correlation id-u kroz više povezanih događaja.',
      'Message contract registry sprečava izmenu objavljene verzije ugovora u mestu.',
      'Failure simulator omogućava ponovljivo uvođenje kašnjenja i duplikacije poruke.',
    ],
  },
  {
    id: 'odp-p3',
    code: 'P3',
    title: 'Testiranje i manual-core-baseline',
    exercise: 'Vežba 4',
    date: '07.04.',
    summary:
      'Ova kontrolna tačka razdvaja dve faze kursa. Do nje tim samostalno projektuje jezgro distribuiranog sistema i osnovne testove, uključujući failure scenarije; nakon toga AI dobija veću ulogu, ali sistem već ima dovoljno testova da se svaki predlog nezavisno proveri.',
    items: [
      'Ključni distribuirani use-case-ovi imaju testove za uspešne, negativne i failure scenarije.',
      'Izveštaj o pokrivenosti je pregledan i najmanje jedna rizična grana je obrazložena ili dodatno pokrivena.',
      'Najmanje jedan bug je najpre reprodukovan testom (uz FailureSimulator), a zatim ispravljen.',
      'Stabilna verzija jezgra je označena Git tag-om `manual-core-baseline`.',
    ],
  },
  {
    id: 'odp-p4',
    code: 'P4',
    title: 'Operativni i napredni nivo — završna odbrana',
    exercise: 'Vežba 5–8',
    date: '26.05.',
    summary:
      'Završni rezultat kursa nije distribuirani sistem čiju implementaciju tim ne razume, već sistem čiji svaki član ume da objasni distribuirani use-case, failure scenario, testove i trade-off arhitektonske odluke svoje projektne celine.',
    items: [
      'Telemetry i command/job tokovi imaju dokumentovanu delivery semantiku i idempotentno rukovanje duplikatom.',
      'Disconnected station tok, dead-letter/replay i transactional outbox/inbox su implementirani i testirani.',
      'Postoje najmanje tri evaluaciona/distribuirana scenarija, uključujući najmanje jedan failure/recovery slučaj (coordination, failover, backpressure ili eventual consistency).',
      'Na odbrani svaki član tima objašnjava svoj deo bez oslanjanja na automatski generisan odgovor.',
    ],
  },
]
