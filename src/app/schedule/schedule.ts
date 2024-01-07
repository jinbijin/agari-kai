export interface ScheduleTable<TableData = undefined> {
  participants: number[];
  data: TableData;
}

export interface ScheduleRound<RoundData = undefined, TableData = undefined> {
  tables: ScheduleTable<TableData>[];
  data: RoundData;
}

export interface ScheduleParameters {
  participantCount: number;
  roundCount: number;
}

export interface Schedule<RoundData = undefined, TableData = undefined> extends ScheduleParameters {
  rounds: ScheduleRound<RoundData, TableData>[];
}
