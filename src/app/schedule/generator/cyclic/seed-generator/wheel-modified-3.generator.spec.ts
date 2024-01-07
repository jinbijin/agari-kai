import { runCyclicGeneratorSuite } from '../testing/cyclic-generator.suite';
import { wheelModifiedThreeGenerator } from './wheel-modified-3.generator';

runCyclicGeneratorSuite(wheelModifiedThreeGenerator, [36, 60]);
