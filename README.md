# JS 实现Angular slider组件
## 需求描述
1.  需求：根据传入的动态数组生成一个节点数为数组长度的slider组件。要求节点直接长度一致，但是显示的值为传入数组的值。
2.  示例：
传入值为[5], 因为只有一个值，slider无法拖动，显示如下
传入值为[5，10，20，30，40，50，55]， 数值之间差值不一定相等，显示如下
3.  实现逻辑：
UI：
先画一条线最为滑动条，再根据传入数组长度来动态生成相应节点数, 通过`滑动条线的长度/数组长度`来动态生成节点之间宽度。 把生成的点覆盖在线上面，进行分段

## 意外处理
#### 问题：
在实现过程中，有遇到一个问题：在父组件页面还没有加载完的时候，已经在执行slider组件的`initDynamicMargin()`方法。 此时，无法拿到slider宽度，来计算相应的`dotMargin`
#### 解决办法：
通过`Promise`来写一个`waitElement()`方法，等页面slider加载完成之后，再去计算节点之间的宽度。
#### 代码实现如下：
```` javascript
  private waitElement(selector: string) {
    return new Promise<void>((resolve) => {
      if (document.querySelector(selector)) {
        resolve();
      }
      const observer = new MutationObserver((mutations) => {
        if (document.querySelector(selector)) {
          resolve();
          observer.disconnect();
        }
      });

      observer.observe(document.body, {
        childList: true,
        subtree: true,
      });
    });
  }

    ngAfterViewInit() {
    // Fix issue: Calculate dotmargin before loaded
    this.waitElement('#container').then(() => {
      this.initDynamicMargin();
    });
  }
 ````



# Slider

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 12.1.0.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.
