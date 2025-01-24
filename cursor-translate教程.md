# Cursor Translate 教程

## 0. 前言

这是一篇简单的从前端开发人员视角介绍 Cursor 编辑器的教程,主要介绍 Cursor 编辑器的安装和使用,以及如何使用 Cursor 编辑器生成代码,并按照产品需求,完善代码,并优化 UI 界面;

教程配套的 git 代码仓库: [`Cursor Translate 翻译应用项目实战`](https://github.com/strawferry/cursor-translate)

AI 交互的记录文档: [`Cursor Composer 记录`](/.specstory/history/composer-交互.md)

## 1. [Cursor](https://www.cursor.com/) 介绍和安装

[Cursor](https://www.cursor.com/) 是一个目前比较流程很火的 AI Code Editor，它可以帮助你快速生成代码，提高开发效率。

![Cursor 官网介绍图](https://raw.githubusercontent.com/strawferry/GSS/master/uPic/20250123/17-39-52-JXEi6A.png)

[Cursor 官网](https://www.cursor.com/) 去下载对应的安装包，安装完成后，打开软件，会提示你注册，注册完成后，就可以开始使用了。

cursor 编辑器是基于 VSCode 开发的，所以基本和 VSCode 界面类似,也可以直接使用 VSCode 的插件。

![09-35-07-reo9nx](https://raw.githubusercontent.com/strawferry/GSS/master/uPic/20250124/09-35-07-reo9nx.png)

## 2. Cursor Translate 翻译应用项目实战

### 2.1 创建项目文件夹,并使用 Cursor 打开

```bash
mkdir Translate && cd Translate
cursor .
# 通过命令行打开,或者使用 cursor 直接打开该文件目录
```

### 2.2 创建 README.md 文件,并写一些产品需求内容,技术选型等

```bash
touch README.md
# 创建好 README.md 文件后,建议给项目做一个 git init 初始化,方便后续的版本控制,当然这个不是必须的
cd Translate
git init
```

### 2.3 AI 生成代码使用

#### 2.3.1 通过 Chat 交互模式,生成代码

1. 打开 Chat 交互模式
2. 输入需求内容,点击发送
3. 等待 AI 生成代码
4. 点击复制代码,复制到 README.md 文件中
5. 点击保存,保存到本地
![Chat 交互模式](https://raw.githubusercontent.com/strawferry/GSS/master/uPic/20250124/09-57-54-2G1u4V.png)

![保存应用或者回退应用代码](https://raw.githubusercontent.com/strawferry/GSS/master/uPic/20250124/10-00-55-GOa3bk.png)

#### 2.3.2 通过 Composer 交互模式,生成代码

1. 打开 Composer 交互模式
2. 输入需求内容,点击发送
3. 等待 AI 生成代码
4. 直接生成文件和代码,不需要复制代码

![Composer 交互模式](https://raw.githubusercontent.com/strawferry/GSS/master/uPic/20250124/10-15-25-zmvtLM.png)

#### 2.3.3 生成 Next.js 项目代码

1. 刚才只是完善了 README.md 文件,现在我们来生成 Next.js 项目代码
2. 打开 Chat 交互模式,问它 如何创建 Nextjs 项目,并跑起来
3. 等待 AI 生成回复,这个地方比较好的方式是生成基本 Next.js 项目代码,然后从根目录复制代码进当前文件夹下面,这样可以避免 AI 生成的代码有问题,导致我们无法运行;
4. 如果确定了技术栈,可以先生成初始代码后,在通过 cursor 打开项目文件,然后再继续下面的交互;

```bash
npx create-next-app@latest translate
✔ Would you like to use TypeScript? … No / Yes
✔ Would you like to use ESLint? … No / Yes
✔ Would you like to use Tailwind CSS? … No / Yes
✔ Would you like your code inside a `src/` directory? … No / Yes
✔ Would you like to use App Router? (recommended) … No / Yes
✔ Would you like to use Turbopack for `next dev`? … No / Yes
✔ Would you like to customize the import alias (`@/*` by default)? … No / Yes
✔ What import alias would you like configured? … @/*

```

![生成 Next.js 项目代码](https://raw.githubusercontent.com/strawferry/GSS/master/uPic/20250124/10-31-13-IjEyvR.png)

#### 2.3.4 让 AI 按照产品需求,完善代码

1. 通过 Composer 交互模式,让 AI 按照产品需求,完善代码
2. 待代码生成结束后,我们先点击 save all 保存所有代码,然后查看程序运行情况
3. 确定代码可以使用后,选择 accept all 接受所有代码
4. 一次生成的代码量不会太多,他会先生成基础代码,然后会有未完成的功能列表,让你去继续选择执行下面的功能,所以我们可以根据产品需求,选择执行下面的功能;
5. 遇到需要安装依赖的,我们根据提示,安装依赖,然后继续执行下面的功能;
6. 继续添加功能,直到所有功能都执行完毕;


![按照产品需求,完善代码](https://raw.githubusercontent.com/strawferry/GSS/master/uPic/20250124/11-21-03-6Y2X5S.png)
![第一次生成,初始样式](https://raw.githubusercontent.com/strawferry/GSS/master/uPic/20250124/11-25-43-926tLL.png)

![4.选取功能点让继续生成](https://raw.githubusercontent.com/strawferry/GSS/master/uPic/20250124/11-37-10-mAldxV.png)

![继续执行功能生成](https://raw.githubusercontent.com/strawferry/GSS/master/uPic/20250124/11-42-33-15UulQ.png)

![安装依赖](https://raw.githubusercontent.com/strawferry/GSS/master/uPic/20250124/11-47-22-qztKIS.png)

![基本功能实现完毕](https://raw.githubusercontent.com/strawferry/GSS/master/uPic/20250124/14-21-29-nyf2no.png)

#### 2.3.5 UI 界面优化精细化调整

方法 1:让其使用某个组件库如: shadcn ,并按照 Apple 的设计风格重新设计一下页面,并添加一些交互功能
![使用组件](https://raw.githubusercontent.com/strawferry/GSS/master/uPic/20250124/14-50-18-hj5cGx.png)
方法 2: 自己手绘草图或者 UI 设计图,让其调整页面,并添加一些交互功能
![使用手绘草图,让其修改](https://raw.githubusercontent.com/strawferry/GSS/master/uPic/20250124/14-53-18-Xlk5ad.png)

#### 2.3.6 使用的一些技巧

1. 报错问题修复,直接在命令行中框选后,直接添加到 Chat 或者 Composer 中,让 AI 帮我们修复报错问题;
![报错问题修复](https://raw.githubusercontent.com/strawferry/GSS/master/uPic/20250124/14-36-38-77k4Dp.png)

2. 可以使用 Chat 模式处理一些简单的问题,如: 如何安装依赖,如何运行程序,如何打包程序等,使用 Composer 模式处理一些复杂的问题还有需要更改文件的地方; 模型能力上目前还是 claude 模型比较好,生成后需要我们自己去优化;

3. `.cursorrules` 文件可以配置一些规则,让 AI 生成代码的时候,按照我们的规则生成,如: 生成的代码需要使用 typescript,生成的代码需要使用 tailwind css 等;

```markdown
# .cursorrules 文件
你是一名资深前端开发专家，精通 ReactJS、NextJS、JavaScript、TypeScript、HTML、CSS 以及现代 UI/UX 框架（如 TailwindCSS、Shadcn、Radix）。
你思维缜密，能够提供细致入微的答案，并擅长逻辑推理。你总是谨慎地提供准确、事实性、深思熟虑的答案，并且在推理方面堪称天才。

严格遵循用户的需求，一丝不苟。
首先逐步思考——用伪代码详细描述你的构建计划。
确认后，再编写代码！
始终编写正确、符合最佳实践、遵循 DRY 原则（不要重复自己）、无错误、功能齐全且可运行的代码，同时确保代码符合以下列出的代码实现指南。
注重代码的简洁性和可读性，而非性能。
完全实现所有请求的功能。
不要留下任何待办事项、占位符或缺失的部分。
确保代码完整！彻底验证最终结果。
包含所有必需的导入，并确保关键组件的命名正确。
保持简洁，尽量减少其他描述。
如果你认为可能没有正确答案，请如实说明。
如果你不知道答案，请如实说明，而不是猜测。

### 编码环境
用户询问以下编程语言相关的问题：
- ReactJS
- NextJS
- JavaScript
- TypeScript
- TailwindCSS
- HTML
- CSS

### 代码实现指南
编写代码时请遵循以下规则：
- 尽可能使用提前返回来提高代码的可读性。
- 始终使用 Tailwind 类来为 HTML 元素设置样式；避免使用 CSS 或标签。
- 在类标签中尽可能使用 `class:` 而不是三元运算符。
- 使用描述性的变量和函数/常量名称。事件函数应以 `handle` 为前缀命名，例如 `onClick` 的事件函数命名为 `handleClick`，`onKeyDown` 的事件函数命名为 `handleKeyDown`。
- 在元素上实现无障碍功能。例如，标签应具有 `tabindex="0"`、`aria-label`、`on:click`、`on:keydown` 等属性。
- 使用 `const` 而不是函数，例如 `const toggle = () =>`。如果可能，定义类型。
- 使用 `clsx` 来处理多个条件类。

```

4. `.cursorignore` 该文件是和 .gitignore 一样的语法,可以配置忽略的文件和文件夹,减少 AI 索引文件的时间,提高生成代码的速度;

5. 可以多个 Chat 和 Composer 分功能模块,进行 AI 交互代码生成,推荐一个插件 [SpecStory (Cursor Extension)](https://marketplace.visualstudio.com/items?itemName=SpecStory.specstory-vscode),该插件可以导出 Chat 和 Composer 的交互记录;

![Chat 和 Composer 的交互记录](https://raw.githubusercontent.com/strawferry/GSS/master/uPic/20250124/16-42-25-niEHE7.png)



### 3. 总结

1. 通过使用 Cursor 编辑器,发现现在 AI 的能力越来越强,可以为我们提效很多;
2. 目前需要学的是和 AI 沟通技巧,让 AI 按照我们的需求生成代码,如何让 AI 按照我们的需求优化代码;
3. 做新产品和小工具通过 Cursor 是真的非常快,不过还是需要一定的产品和代码基础,不然容易出现 bug 等边界问题;


