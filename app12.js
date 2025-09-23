class CoverEditor {
    constructor() {
        this.canvas = document.getElementById('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.texts = [];
        this.selectedText = null;
        this.isDragging = false;
        this.dragOffset = { x: 0, y: 0 };
        this.backgroundImage = null;
        this.animationId = null;

        this.init();
        this.startAnimation();
    }

    startAnimation() {
        const animate = () => {
            if (this.selectedText) {
                this.render();
            }
            this.animationId = requestAnimationFrame(animate);
        };
        animate();
    }

    init() {
        const uploadArea = document.getElementById('uploadArea');
        const imageInput = document.getElementById('imageInput');
        const addTextBtn = document.getElementById('addTextBtn');
        const exportBtn = document.getElementById('exportBtn');
        const deleteBtn = document.getElementById('deleteBtn');

        uploadArea.addEventListener('click', () => imageInput.click());
        uploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadArea.style.background = '#f0f0f0';
        });
        uploadArea.addEventListener('dragleave', () => {
            uploadArea.style.background = '';
        });
        uploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadArea.style.background = '';
            const file = e.dataTransfer.files[0];
            if (file && file.type.startsWith('image/')) {
                this.loadImage(file);
            }
        });

        imageInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                this.loadImage(file);
            }
        });

        addTextBtn.addEventListener('click', () => this.addText());
        exportBtn.addEventListener('click', () => this.exportImage());
        deleteBtn.addEventListener('click', () => this.deleteSelectedText());

        this.canvas.addEventListener('mousedown', (e) => this.handleMouseDown(e));
        this.canvas.addEventListener('mousemove', (e) => this.handleMouseMove(e));
        this.canvas.addEventListener('mouseup', () => this.handleMouseUp());
        this.canvas.addEventListener('dblclick', (e) => this.handleDoubleClick(e));

        this.initToolbar();
    }

    loadImage(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                this.backgroundImage = img;
                this.setupCanvas(img);
                document.getElementById('uploadArea').style.display = 'none';
                document.getElementById('canvasContainer').style.display = 'flex';
                document.getElementById('toolbar').style.display = 'flex';
                document.getElementById('addTextBtn').disabled = false;
                document.getElementById('exportBtn').disabled = false;
                this.render();
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }

    setupCanvas(img) {
        const maxWidth = window.innerWidth - 200;
        const maxHeight = window.innerHeight * 0.7;
        let width = img.width;
        let height = img.height;

        if (width > maxWidth || height > maxHeight) {
            const ratio = Math.min(maxWidth / width, maxHeight / height);
            width = width * ratio;
            height = height * ratio;
        }

        this.canvas.width = width;
        this.canvas.height = height;
    }

    addText() {
        const text = {
            content: '双击编辑文本',
            x: this.canvas.width / 2,
            y: this.canvas.height / 2,
            fontSize: 32,
            fontFamily: '微软雅黑',
            color: '#ffffff',
            bold: false,
            italic: false,
            align: 'center'
        };
        this.texts.push(text);
        this.selectText(text);
        this.render();
    }

    selectText(text) {
        this.selectedText = text;
        this.updateToolbar();
        document.getElementById('deleteBtn').disabled = false;
    }

    deleteSelectedText() {
        if (this.selectedText) {
            const index = this.texts.indexOf(this.selectedText);
            if (index > -1) {
                this.texts.splice(index, 1);
                this.selectedText = null;
                this.updateToolbar();
                document.getElementById('deleteBtn').disabled = true;
                this.render();
            }
        }
    }

    handleMouseDown(e) {
        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        for (let i = this.texts.length - 1; i >= 0; i--) {
            const text = this.texts[i];
            if (this.isPointInText(x, y, text)) {
                this.selectedText = text;
                this.isDragging = true;
                this.dragOffset.x = x - text.x;
                this.dragOffset.y = y - text.y;
                this.updateToolbar();
                document.getElementById('deleteBtn').disabled = false;
                this.render();
                return;
            }
        }

        this.selectedText = null;
        this.updateToolbar();
        document.getElementById('deleteBtn').disabled = true;
        this.render();
    }

    handleMouseMove(e) {
        if (this.isDragging && this.selectedText) {
            const rect = this.canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            this.selectedText.x = x - this.dragOffset.x;
            this.selectedText.y = y - this.dragOffset.y;
            this.render();
        }
    }

    handleMouseUp() {
        this.isDragging = false;
    }

    handleDoubleClick(e) {
        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        for (let i = this.texts.length - 1; i >= 0; i--) {
            const text = this.texts[i];
            if (this.isPointInText(x, y, text)) {
                const newContent = prompt('编辑文本:', text.content);
                if (newContent !== null && newContent.trim() !== '') {
                    text.content = newContent;
                    this.render();
                }
                return;
            }
        }
    }

    isPointInText(x, y, text) {
        this.ctx.font = this.getFont(text);
        this.ctx.textAlign = text.align;
        const metrics = this.ctx.measureText(text.content);

        let textX = text.x;
        const textY = text.y;
        const textWidth = metrics.width;
        const textHeight = text.fontSize;

        if (text.align === 'center') {
            textX -= textWidth / 2;
        } else if (text.align === 'right') {
            textX -= textWidth;
        }

        return x >= textX - 5 && x <= textX + textWidth + 5 &&
               y >= textY - 5 && y <= textY + textHeight + 5;
    }

    getFont(text) {
        let font = '';
        if (text.italic) font += 'italic ';
        if (text.bold) font += 'bold ';
        font += `${text.fontSize}px ${text.fontFamily}`;
        return font;
    }

    render() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        if (this.backgroundImage) {
            this.ctx.drawImage(this.backgroundImage, 0, 0, this.canvas.width, this.canvas.height);
        }

        this.texts.forEach(text => {
            // 绘制阴影
            this.ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
            this.ctx.shadowBlur = 4;
            this.ctx.shadowOffsetX = 2;
            this.ctx.shadowOffsetY = 2;

            this.ctx.font = this.getFont(text);
            this.ctx.fillStyle = text.color;
            this.ctx.textAlign = text.align;
            this.ctx.textBaseline = 'top';
            this.ctx.fillText(text.content, text.x, text.y);

            // 清除阴影设置
            this.ctx.shadowColor = 'transparent';
            this.ctx.shadowBlur = 0;
            this.ctx.shadowOffsetX = 0;
            this.ctx.shadowOffsetY = 0;

            if (text === this.selectedText) {
                // 绘制选中边框 - 更炫酷的效果
                this.ctx.strokeStyle = '#667eea';
                this.ctx.lineWidth = 3;
                this.ctx.setLineDash([5, 5]);
                const metrics = this.ctx.measureText(text.content);
                let textX = text.x;
                if (text.align === 'center') {
                    textX -= metrics.width / 2;
                } else if (text.align === 'right') {
                    textX -= metrics.width;
                }

                // 绘制动态虚线边框
                const time = Date.now() * 0.005;
                this.ctx.lineDashOffset = -time * 10;
                this.ctx.strokeRect(textX - 8, text.y - 8, metrics.width + 16, text.fontSize + 16);
                this.ctx.setLineDash([]);
                this.ctx.lineDashOffset = 0;
            }
        });
    }

    initToolbar() {
        const fontFamily = document.getElementById('fontFamily');
        const fontSize = document.getElementById('fontSize');
        const fontColor = document.getElementById('fontColor');
        const boldBtn = document.getElementById('boldBtn');
        const italicBtn = document.getElementById('italicBtn');
        const alignLeft = document.getElementById('alignLeft');
        const alignCenter = document.getElementById('alignCenter');
        const alignRight = document.getElementById('alignRight');

        fontFamily.addEventListener('change', () => {
            if (this.selectedText) {
                this.selectedText.fontFamily = fontFamily.value;
                this.render();
            }
        });

        fontSize.addEventListener('input', () => {
            if (this.selectedText) {
                this.selectedText.fontSize = parseInt(fontSize.value);
                this.render();
            }
        });

        fontColor.addEventListener('input', () => {
            if (this.selectedText) {
                this.selectedText.color = fontColor.value;
                this.render();
            }
        });

        boldBtn.addEventListener('click', () => {
            if (this.selectedText) {
                this.selectedText.bold = !this.selectedText.bold;
                boldBtn.classList.toggle('active');
                this.render();
            }
        });

        italicBtn.addEventListener('click', () => {
            if (this.selectedText) {
                this.selectedText.italic = !this.selectedText.italic;
                italicBtn.classList.toggle('active');
                this.render();
            }
        });

        alignLeft.addEventListener('click', () => {
            if (this.selectedText) {
                this.selectedText.align = 'left';
                this.updateAlignButtons('left');
                this.render();
            }
        });

        alignCenter.addEventListener('click', () => {
            if (this.selectedText) {
                this.selectedText.align = 'center';
                this.updateAlignButtons('center');
                this.render();
            }
        });

        alignRight.addEventListener('click', () => {
            if (this.selectedText) {
                this.selectedText.align = 'right';
                this.updateAlignButtons('right');
                this.render();
            }
        });
    }

    updateToolbar() {
        if (this.selectedText) {
            document.getElementById('fontFamily').value = this.selectedText.fontFamily;
            document.getElementById('fontSize').value = this.selectedText.fontSize;
            document.getElementById('fontColor').value = this.selectedText.color;
            document.getElementById('boldBtn').classList.toggle('active', this.selectedText.bold);
            document.getElementById('italicBtn').classList.toggle('active', this.selectedText.italic);
            this.updateAlignButtons(this.selectedText.align);
        }
    }

    updateAlignButtons(align) {
        document.getElementById('alignLeft').classList.toggle('active', align === 'left');
        document.getElementById('alignCenter').classList.toggle('active', align === 'center');
        document.getElementById('alignRight').classList.toggle('active', align === 'right');
    }

    exportImage() {
        this.selectedText = null;
        this.render();

        setTimeout(() => {
            const link = document.createElement('a');
            link.download = `cover-${Date.now()}.png`;
            link.href = this.canvas.toDataURL('image/png');
            link.click();
        }, 100);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new CoverEditor();
});