import angular from 'angular';
import Sharer from './sharer.js';

const demoApp = angular.module('demo', [Sharer.name]);
angular.bootstrap(document, [demoApp.name]);
