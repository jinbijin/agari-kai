import { runCyclicGeneratorSuite } from '../testing/cyclic-generator.suite';
import { wheelGenerator } from './wheel.generator';

runCyclicGeneratorSuite(wheelGenerator, [20, 28]);
