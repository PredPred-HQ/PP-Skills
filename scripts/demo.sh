#!/bin/bash

# PredP.red AI Skill - 演示脚本
# 用于录制演示视频或现场演示

set -e

echo "🎬 PredP.red AI Skill 演示脚本"
echo "================================"
echo ""

# 颜色定义
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# 检查环境
check_environment() {
    echo -e "${BLUE}检查环境...${NC}"
    
    if ! command -v node &> /dev/null; then
        echo -e "${RED}错误：需要安装 Node.js${NC}"
        exit 1
    fi
    
    if [ ! -f ".env" ]; then
        echo -e "${YELLOW}警告：.env 文件不存在，请复制 .env.example 并配置${NC}"
        echo "cp .env.example .env"
        exit 1
    fi
    
    echo -e "${GREEN}✓ 环境检查通过${NC}"
    echo ""
}

# 安装依赖
install_dependencies() {
    echo -e "${BLUE}安装依赖...${NC}"
    npm install
    echo -e "${GREEN}✓ 依赖安装完成${NC}"
    echo ""
}

# 编译项目
build_project() {
    echo -e "${BLUE}编译项目...${NC}"
    npm run build
    echo -e "${GREEN}✓ 编译完成${NC}"
    echo ""
}

# 演示场景 1: 查看市场
demo_view_markets() {
    echo -e "${YELLOW}=== 演示场景 1: 查看市场 ===${NC}"
    echo ""
    
    echo "命令：查看 predp.red 热门市场"
    echo ""
    
    npm run dev -- "查看 predp.red 热门市场"
    
    echo ""
    echo -e "${GREEN}✓ 场景 1 完成${NC}"
    echo ""
}

# 演示场景 2: 查看特定市场详情
demo_market_details() {
    echo -e "${YELLOW}=== 演示场景 2: 查看市场详情 ===${NC}"
    echo ""
    
    echo "命令：显示市场 #123 的详细信息"
    echo ""
    
    npm run dev -- "显示市场 #123 的详细信息"
    
    echo ""
    echo -e "${GREEN}✓ 场景 2 完成${NC}"
    echo ""
}

# 演示场景 3: 买入操作
demo_buy() {
    echo -e "${YELLOW}=== 演示场景 3: 买入操作 ===${NC}"
    echo ""
    
    echo "命令：在市场 #123 买入 100 USDT 的是"
    echo ""
    
    npm run dev -- "在市场 #123 买入 100 USDT 的是"
    
    echo ""
    echo -e "${GREEN}✓ 场景 3 完成${NC}"
    echo ""
}

# 演示场景 4: 卖出操作
demo_sell() {
    echo -e "${YELLOW}=== 演示场景 4: 卖出操作 ===${NC}"
    echo ""
    
    echo "命令：卖出市场 #123 的所有持仓"
    echo ""
    
    npm run dev -- "卖出市场 #123 的所有持仓"
    
    echo ""
    echo -e "${GREEN}✓ 场景 4 完成${NC}"
    echo ""
}

# 演示场景 5: 查看持仓
demo_positions() {
    echo -e "${YELLOW}=== 演示场景 5: 查看持仓 ===${NC}"
    echo ""
    
    echo "命令：我有哪些持仓？"
    echo ""
    
    npm run dev -- "我有哪些持仓？"
    
    echo ""
    echo -e "${GREEN}✓ 场景 5 完成${NC}"
    echo ""
}

# 完整演示流程
full_demo() {
    echo -e "${BLUE}================================${NC}"
    echo -e "${BLUE}    PredP.red AI Skill 完整演示${NC}"
    echo -e "${BLUE}================================${NC}"
    echo ""
    
    check_environment
    install_dependencies
    build_project
    
    echo "准备开始演示..."
    echo ""
    echo "提示："
    echo "- 录制软件：OBS Studio / QuickTime"
    echo "- 分辨率：1920x1080"
    echo "- 帧率：30fps"
    echo ""
    read -p "按回车键开始演示..."
    
    demo_view_markets
    sleep 2
    
    demo_market_details
    sleep 2
    
    demo_buy
    sleep 2
    
    demo_sell
    sleep 2
    
    demo_positions
    sleep 2
    
    echo ""
    echo -e "${GREEN}================================${NC}"
    echo -e "${GREEN}    演示完成！${NC}"
    echo -e "${GREEN}================================${NC}"
    echo ""
    echo "录制的视频已保存，请检查您的录制软件"
    echo ""
}

# 运行测试
run_tests() {
    echo -e "${BLUE}运行测试...${NC}"
    npm test
    echo -e "${GREEN}✓ 测试通过${NC}"
    echo ""
}

# 显示帮助
show_help() {
    echo "PredP.red AI Skill 演示脚本"
    echo ""
    echo "用法:"
    echo "  ./demo.sh [command]"
    echo ""
    echo "命令:"
    echo "  check       检查环境"
    echo "  install     安装依赖"
    echo "  build       编译项目"
    echo "  test        运行测试"
    echo "  demo1       演示场景 1: 查看市场"
    echo "  demo2       演示场景 2: 查看市场详情"
    echo "  demo3       演示场景 3: 买入操作"
    echo "  demo4       演示场景 4: 卖出操作"
    echo "  demo5       演示场景 5: 查看持仓"
    echo "  full        完整演示流程 (推荐用于录制)"
    echo "  help        显示此帮助信息"
    echo ""
    echo "示例:"
    echo "  ./demo.sh full        # 运行完整演示"
    echo "  ./demo.sh demo3       # 运行买入演示"
    echo ""
}

# 主函数
main() {
    case "${1:-help}" in
        check)
            check_environment
            ;;
        install)
            install_dependencies
            ;;
        build)
            build_project
            ;;
        test)
            run_tests
            ;;
        demo1)
            demo_view_markets
            ;;
        demo2)
            demo_market_details
            ;;
        demo3)
            demo_buy
            ;;
        demo4)
            demo_sell
            ;;
        demo5)
            demo_positions
            ;;
        full)
            full_demo
            ;;
        help|*)
            show_help
            ;;
    esac
}

main "$@"
