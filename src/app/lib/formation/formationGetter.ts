import { concatMap, Observable, of } from "rxjs";
import { ViewPeriod } from "../periods/viewPeriod";
import { FormationRepository } from "./repository";
import { S11Formation } from "../formation";
import { PoolUser } from "../pool/user";
import { S11FormationMap } from "../../poolmodule/allinonegame/allinonegame.component";
import { Pool } from "../pool";

export class FormationGetter {
  private formationsMaps: Map<string | number, S11FormationMap> = new Map();

  constructor(private formationRepository: FormationRepository) {}

  public getFormationMap(
    pool: Pool,
    poolUsers: PoolUser[],
    viewPeriod: ViewPeriod
  ): Observable<S11FormationMap> {
    const formationMap = this.formationsMaps.get(viewPeriod.getId());
    if (formationMap != undefined) {
      return of(formationMap);
    }
    const poolUserMap: Map<string | number, PoolUser> = new Map();
    poolUsers.forEach((poolUser) =>
      poolUserMap.set(poolUser.getId(), poolUser)
    );
    return this.formationRepository
      .getObjectMap(pool, poolUserMap, viewPeriod)
      .pipe(
        concatMap(
          (s11FormationMap: S11FormationMap): Observable<S11FormationMap> => {
            this.formationsMaps.set(viewPeriod.getId(), s11FormationMap);
            return of(s11FormationMap);
          }
        )
      );
  }

  public getFormation(
    viewPeriod: ViewPeriod,    
    poolUser: PoolUser
  ): Observable<S11Formation> {
    return this.getFormationMap(poolUser.getPool(), [poolUser], viewPeriod).pipe(
      concatMap(
        (s11FormationMap: S11FormationMap): Observable<S11Formation> => {
          const formation = s11FormationMap.get(+poolUser.getId());
          if (formation === undefined) {
            throw new Error(
              "no formation found for poolUserId : " + poolUser.getId()
            );
          }
          return of(formation);
        }
      )
    );
  }
}

export interface PoolUserWithFormation {
  poolUser: PoolUser,
  viewPeriod: ViewPeriod,
  formation: S11Formation
}