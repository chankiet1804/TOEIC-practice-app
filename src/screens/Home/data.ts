import { FlagTest } from "../../data/flags";
import { ListeningPratice } from "../../data/listening";
import { ReadingPratice } from "../../data/reading";
import { SolarSystemTest } from "../../data/solarSystem";
import { SpeakingPratice } from "../../data/speaking";
import { Test, Vocab } from "../../data/types";
import { Vocabulary } from "../../data/vocabulary";
import { WritingPratice } from "../../data/writing";

export const skills: Test[] = [ListeningPratice, ReadingPratice,SpeakingPratice,WritingPratice];

export const vocabulary: Vocab[] = [Vocabulary];