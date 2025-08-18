import { JsonPoolCompetitor } from '../competitor/json';
import { JsonUser } from '../../user/mapper';
import { JsonSubstitution } from '../../editAction/substitution/json';
import { JsonTransfer } from '../../editAction/transfer/json';
import { JsonReplacement } from '../../editAction/replacement/json';

export interface JsonPoolUser {
  id: number;
  user: JsonUser;
  admin: boolean;
  competitors: JsonPoolCompetitor[];
  hasAssembleFormation: boolean;
  nrOfAssembled?: number;
  nrOfTransfers?: number;
  replacements?: JsonReplacement[];
  transfers?: JsonTransfer[];
  substitutions?: JsonSubstitution[];
}