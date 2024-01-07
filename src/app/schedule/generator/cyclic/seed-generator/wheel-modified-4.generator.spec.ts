import { runCyclicGeneratorSuite } from '../testing/cyclic-generator.suite';
import { wheelModifiedFourGenerator } from './wheel-modified-4.generator';

runCyclicGeneratorSuite(wheelModifiedFourGenerator, [24, 48]);
