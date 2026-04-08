export interface Topic {
  id: string;
  name: string;
  displayName: string;
  image: string;
  accentColor: string;
  level: string;
  tags: string[];
  connections: string[];
  description: string;
  learningPaths: string[];
}

export interface LearningPath {
  id: string;
  title: string;
  difficulty: string;
  image: string;
  accentColor: string;
  stage: number;
  topics: string[];
  description: string;
}

export interface GraphResponse {
  topics: Topic[];
  learningPaths: LearningPath[];
  topicTags: string[];
  learningStages: string[];
}
