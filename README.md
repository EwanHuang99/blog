### 应用初始化
```
npm install hexo-cli -g
npm install
```

### 编译静态源文件
执行以下命令，生成public目录及静态源文件
```
hexo generate
```
或者
```
hexo g
```

### 本地调试
```
hexo server
```
或者
```
hexo s
```

### 发布静态文件至仓库
```
hexo deploy
```
或者
```
hexo d
```

### 结合生成静态文件与发布
```
hexo d -g
```
或者
```
hexo g -d
```

### 清除已生成的文件和编译缓存
特别是项目文件更名、目录调整等情况
```
hexo clean
```