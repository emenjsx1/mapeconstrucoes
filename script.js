/* ==========================================================================
   INTERACTIVE JAVASCRIPT - MAPE CONSTRUÇÕES
   Before/After Sliders, Multi-Step Wizard, Portfolio Filter & Mobile Menu
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================================================
       1. MOBILE NAVIGATION MENU
       ========================================================================== */
    const hamburgerBtn = document.getElementById('hamburgerBtn');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (hamburgerBtn && navMenu) {
        hamburgerBtn.addEventListener('click', () => {
            hamburgerBtn.classList.toggle('active');
            navMenu.classList.toggle('open');
        });

        // Close menu when clicking navigation links or scrolling
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                hamburgerBtn.classList.remove('active');
                navMenu.classList.remove('open');

                // Add active class manually
                navLinks.forEach(l => l.classList.remove('active'));
                link.classList.add('active');
            });
        });
    }

    // Scroll active link detection
    window.addEventListener('scroll', () => {
        const sections = document.querySelectorAll('section');
        const scrollPosition = window.scrollY + 100;

        sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.getAttribute('id');

            if (scrollPosition >= top && scrollPosition < top + height) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    });


    /* ==========================================================================
       2. INTERACTIVE BEFORE/AFTER DRAGGABLE SLIDER
       ========================================================================== */
    function initBeforeAfterSlider(sliderId) {
        const slider = document.getElementById(sliderId);
        if (!slider) return;

        const afterImg = slider.querySelector('.after-img');
        const sliderLine = slider.querySelector('.slider-line');
        const sliderButton = slider.querySelector('.slider-button');

        function moveSlider(x) {
            const rect = slider.getBoundingClientRect();
            let position = ((x - rect.left) / rect.width) * 100;

            // Restrict position borders
            if (position < 0) position = 0;
            if (position > 100) position = 100;

            // Update DOM Styles
            afterImg.style.width = `${position}%`;
            sliderLine.style.left = `${position}%`;
            sliderButton.style.left = `${position}%`;
        }

        // Mouse Events
        let isDragging = false;

        slider.addEventListener('mousedown', (e) => {
            isDragging = true;
            moveSlider(e.clientX);
        });

        window.addEventListener('mouseup', () => {
            isDragging = false;
        });

        slider.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            moveSlider(e.clientX);
        });

        // Touch Events (Mobile/Tablet)
        slider.addEventListener('touchstart', (e) => {
            isDragging = true;
            moveSlider(e.touches[0].clientX);
        });

        window.addEventListener('touchend', () => {
            isDragging = false;
        });

        slider.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            moveSlider(e.touches[0].clientX);
        });
    }

    // Initialize both sliders
    initBeforeAfterSlider('sliderWaterproof');
    initBeforeAfterSlider('sliderInsulation');


    /* ==========================================================================
       3. PORTFOLIO FILTER WITH ABAS
       ========================================================================== */
    const filterButtons = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');

    if (filterButtons.length > 0) {
        filterButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                // Toggle active button
                filterButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                const filterValue = btn.getAttribute('data-filter');

                // Filter elements
                portfolioItems.forEach(item => {
                    const category = item.getAttribute('data-category');

                    if (filterValue === 'all' || category === filterValue) {
                        item.style.display = 'flex';
                        // Add fade animation
                        item.style.opacity = '0';
                        setTimeout(() => {
                            item.style.opacity = '1';
                            item.style.transition = 'opacity 0.4s ease';
                        }, 50);
                    } else {
                        item.style.display = 'none';
                    }
                });
            });
        });
    }


    /* ==========================================================================
       4. QUALIFICATION MULTI-STEP WIZARD (FILTRO DE CURIOSOS)
       ========================================================================== */
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const progressFill = document.getElementById('progressFill');
    const stepDots = document.querySelectorAll('.step-dot');
    const steps = document.querySelectorAll('.wizard-step');
    const wizardContainer = document.getElementById('wizardContainer');
    const successScreen = document.getElementById('successScreen');

    // Checkbox and location display toggles
    const locationRadios = document.querySelectorAll('input[name="location"]');
    const otherLocationGroup = document.getElementById('otherLocationGroup');

    let currentStep = 1;
    const totalSteps = 5;

    // Toggle custom location input
    if (locationRadios.length > 0 && otherLocationGroup) {
        locationRadios.forEach(radio => {
            radio.addEventListener('change', () => {
                if (radio.value === 'Outra') {
                    otherLocationGroup.style.display = 'flex';
                    document.getElementById('otherLocationInput').setAttribute('required', 'true');
                } else {
                    otherLocationGroup.style.display = 'none';
                    document.getElementById('otherLocationInput').removeAttribute('required');
                }
            });
        });
    }

    // Step navigation buttons
    if (nextBtn && prevBtn) {
        nextBtn.addEventListener('click', () => {
            if (validateStep(currentStep)) {
                if (currentStep < totalSteps) {
                    currentStep++;
                    updateWizard();
                } else {
                    // Final Submit
                    submitSimulatorForm();
                }
            }
        });

        prevBtn.addEventListener('click', () => {
            if (currentStep > 1) {
                currentStep--;
                updateWizard();
            }
        });
    }

    // Updates visual steps state
    function updateWizard() {
        // Update steps views
        steps.forEach(step => {
            step.classList.remove('active');
            if (parseInt(step.getAttribute('data-step-content')) === currentStep) {
                step.classList.add('active');
            }
        });

        // Update progress bar fill
        const progressPercentage = ((currentStep - 1) / (totalSteps - 1)) * 100;
        progressFill.style.width = `${progressPercentage === 0 ? 10 : progressPercentage}%`;

        // Update step dots classes
        stepDots.forEach(dot => {
            const stepNum = parseInt(dot.getAttribute('data-step'));
            dot.classList.remove('active', 'completed');

            if (stepNum === currentStep) {
                dot.classList.add('active');
            } else if (stepNum < currentStep) {
                dot.classList.add('completed');
            }
        });

        // Configure actions buttons
        prevBtn.disabled = currentStep === 1;

        if (currentStep === totalSteps) {
            nextBtn.innerHTML = `Submeter Simulação <i class="fa-solid fa-paper-plane"></i>`;
            nextBtn.style.backgroundColor = '#22C55E'; // Green accent for submit
            nextBtn.style.boxShadow = '0 4px 20px rgba(34, 197, 148, 0.3)';
        } else {
            nextBtn.innerHTML = `Continuar <i class="fa-solid fa-arrow-right"></i>`;
            nextBtn.style.backgroundColor = 'var(--primary)';
            nextBtn.style.boxShadow = '0 4px 20px rgba(249, 115, 22, 0.3)';
        }
    }

    // Validates inputs for the active step (Crucial conversion filters)
    function validateStep(step) {
        let isValid = true;
        const activeStepEl = document.querySelector(`[data-step-content="${step}"]`);

        if (step === 4) {
            // Geographic check: if other is selected, other text field must be validated
            const selectedLocationRadio = document.querySelector('input[name="location"]:checked');
            if (!selectedLocationRadio) {
                alert('Por favor, selecione uma localização.');
                isValid = false;
            } else if (selectedLocationRadio.value === 'Outra') {
                const otherInput = document.getElementById('otherLocationInput');
                if (!otherInput.value.trim()) {
                    otherInput.classList.add('invalid-input');
                    alert('Por favor, indique a localização do seu projeto.');
                    isValid = false;
                } else {
                    otherInput.classList.remove('invalid-input');
                }
            }
        }
        else if (step === 5) {
            // Final Contact Validation
            const nameEl = document.getElementById('userName');
            const phoneEl = document.getElementById('userPhone');
            const emailEl = document.getElementById('userEmail');

            let errors = [];

            if (!nameEl.value.trim()) {
                nameEl.classList.add('invalid-input');
                errors.push('Nome Completo');
                isValid = false;
            } else {
                nameEl.classList.remove('invalid-input');
            }

            if (!phoneEl.value.trim() || phoneEl.value.length < 7) {
                phoneEl.classList.add('invalid-input');
                errors.push('WhatsApp/Telemóvel válido');
                isValid = false;
            } else {
                phoneEl.classList.remove('invalid-input');
            }

            // Email basic regex
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailEl.value.trim() || !emailPattern.test(emailEl.value)) {
                emailEl.classList.add('invalid-input');
                errors.push('Endereço de E-mail corporativo ou pessoal válido');
                isValid = false;
            } else {
                emailEl.classList.remove('invalid-input');
            }

            if (!isValid) {
                alert(`Por favor, preencha os seguintes campos obrigatórios:\n- ${errors.join('\n- ')}`);
            }
        }

        return isValid;
    }

    // Handles the final submission trigger (Converting and capturing details)
    function submitSimulatorForm() {
        // Collect choices (for display or future API posting)
        const projectType = document.querySelector('input[name="projectType"]:checked').value;
        const budget = document.querySelector('input[name="budget"]:checked').value;
        const urgency = document.querySelector('input[name="urgency"]:checked').value;
        const locationSelected = document.querySelector('input[name="location"]:checked').value;
        const otherLocText = document.getElementById('otherLocationInput').value;
        const finalLocation = locationSelected === 'Outra' ? otherLocText : locationSelected;

        const finalName = document.getElementById('userName').value;
        const finalPhone = document.getElementById('userPhone').value;
        const finalEmail = document.getElementById('userEmail').value;

        // Perform custom micro-interaction submit loading
        nextBtn.disabled = true;
        nextBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> A Enviar...`;

        setTimeout(() => {
            // Hide wizard, show success
            wizardContainer.style.display = 'none';
            successScreen.style.display = 'block';

            // Scroll smoothly to success screen
            document.getElementById('simulador').scrollIntoView({ behavior: 'smooth' });
        }, 1500);
    }

    /* ==========================================================================
       5. MAPE AI VISION INSPECTOR & DIAGNOSTIC SIMULATOR
       ========================================================================== */
    const btnPresets = document.querySelectorAll('.btn-preset');
    const aiImageUpload = document.getElementById('aiImageUpload');
    const btnTriggerUpload = document.getElementById('btnTriggerUpload');
    const fileNameDisplay = document.getElementById('fileNameDisplay');
    const previewPlaceholder = document.getElementById('previewPlaceholder');
    const previewImgContainer = document.getElementById('previewImgContainer');
    const previewImage = document.getElementById('previewImage');
    const laserScanner = document.getElementById('laserScanner');
    const btnStartScan = document.getElementById('btnStartScan');

    const retroTerminal = document.getElementById('retroTerminal');
    const terminalOutput = document.getElementById('terminalOutput');
    const aiReportCard = document.getElementById('aiReportCard');
    const aiIdlePanel = document.getElementById('aiIdlePanel');

    const reportPatologia = document.getElementById('reportPatologia');
    const reportGravidade = document.getElementById('reportGravidade');
    const reportConfianca = document.getElementById('reportConfianca');
    const reportRecomendacao = document.getElementById('reportRecomendacao');
    const aiWhatsappBtn = document.getElementById('aiWhatsappBtn');

    let activeScenario = null;

    // 5.1 Click Preset Scenarios
    btnPresets.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active classes from other presets
            btnPresets.forEach(b => b.classList.remove('active'));
            // Set active
            btn.classList.add('active');

            // Get data
            const scenario = btn.getAttribute('data-scenario');
            const imgPath = btn.getAttribute('data-img');
            activeScenario = scenario;

            // Update preview image
            previewImage.src = imgPath;
            previewPlaceholder.style.display = 'none';
            previewImgContainer.style.display = 'block';

            // Clear custom upload input
            aiImageUpload.value = '';
            fileNameDisplay.textContent = 'Nenhum ficheiro selecionado';

            // Enable Scan button
            btnStartScan.disabled = false;

            // Reset report & terminal displays to idle
            resetAIOutputs();
        });
    });

    // 5.2 Trigger custom upload click
    if (btnTriggerUpload && aiImageUpload) {
        btnTriggerUpload.addEventListener('click', () => {
            aiImageUpload.click();
        });
    }

    // 5.3 Handle custom upload changes
    if (aiImageUpload) {
        aiImageUpload.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                fileNameDisplay.textContent = file.name;

                // Read image file using FileReader
                const reader = new FileReader();
                reader.onload = function(event) {
                    previewImage.src = event.target.result;
                    previewPlaceholder.style.display = 'none';
                    previewImgContainer.style.display = 'block';

                    // Disable all presets
                    btnPresets.forEach(b => b.classList.remove('active'));
                    activeScenario = 'custom';

                    // Enable scan
                    btnStartScan.disabled = false;

                    // Reset report & terminal displays to idle
                    resetAIOutputs();
                };
                reader.readAsDataURL(file);
            }
        });
    }

    function resetAIOutputs() {
        aiIdlePanel.style.display = 'flex';
        retroTerminal.style.display = 'none';
        aiReportCard.style.display = 'none';
        terminalOutput.innerHTML = '';
        laserScanner.classList.remove('scanning');
    }

    // 5.4 Start scanner analysis simulation
    if (btnStartScan) {
        btnStartScan.addEventListener('click', () => {
            if (!activeScenario) return;

            // UI locking during processing
            btnStartScan.disabled = true;
            btnPresets.forEach(b => b.disabled = true);
            if (btnTriggerUpload) btnTriggerUpload.disabled = true;

            // Toggle panels
            aiIdlePanel.style.display = 'none';
            aiReportCard.style.display = 'none';
            retroTerminal.style.display = 'flex';
            terminalOutput.innerHTML = '';

            // Add sweep laser animation
            laserScanner.classList.add('scanning');

            // Terminal log simulation feeds
            const logLines = [
                { text: "[SYS] A inicializar módulo MAPE Vision AI v4.8...", type: "system" },
                { text: "[SYS] Kernel de processamento neuronal carregado com sucesso.", type: "system" },
                { text: `[SCAN] A analisar a imagem fornecida (${activeScenario === 'custom' ? 'Foto de Upload' : 'Exemplo Técnico'})...`, type: "scan" },
                { text: "[SCAN] A executar digitalização de matriz de píxeis e gradientes...", type: "scan" },
                { text: "[IA] Padrões de patologia civil detetados na imagem.", type: "ia" },
                { text: "[IA] A calcular vetores de gravidade e taxa de degradação...", type: "ia" },
                { text: "[IA] Análise preditiva finalizada com elevada precisão.", type: "ia" },
                { text: "[SYS] A gerar Relatório Técnico Preliminar de Patologia...", type: "system" }
            ];

            let lineIndex = 0;
            function printTerminalLine() {
                if (lineIndex < logLines.length) {
                    const line = logLines[lineIndex];
                    const p = document.createElement('div');
                    p.className = 'terminal-line';

                    if (line.text.startsWith('[ALERT]')) {
                        p.className += ' warning-msg';
                    } else if (line.text.startsWith('[SYS]')) {
                        p.className += ' success-msg';
                    }

                    p.innerHTML = `<span style="color: #64748b;">${new Date().toLocaleTimeString()}</span> &gt; ${line.text}`;
                    terminalOutput.appendChild(p);
                    terminalOutput.scrollTop = terminalOutput.scrollHeight;

                    lineIndex++;
                    // Delay between lines
                    setTimeout(printTerminalLine, 400 + Math.random() * 200);
                } else {
                    // Finished printing logs. Reveal final report.
                    setTimeout(revealReportCard, 600);
                }
            }

            // Start line feed
            setTimeout(printTerminalLine, 200);
        });
    }

    // 5.5 Final reveal report card
    function revealReportCard() {
        // Unlock inputs
        btnStartScan.disabled = false;
        btnPresets.forEach(b => b.disabled = false);
        if (btnTriggerUpload) btnTriggerUpload.disabled = false;

        // Hide terminal & laser scanner
        laserScanner.classList.remove('scanning');
        retroTerminal.style.display = 'none';

        // Populate specific diagnostic metrics
        let patologiaName = "";
        let gravidade = "";
        let gravidadeClass = "";
        let confianca = "";
        let recomendacao = "";
        let whatsappText = "";

        switch (activeScenario) {
            case 'fissura':
                patologiaName = "Fissura Estrutural por Assentamento de Alvenaria";
                gravidade = "Alto Risco";
                gravidadeClass = "badge-orange";
                confianca = "94.6%";
                recomendacao = "Intervenção técnica prioritária. Requer escareação da fissura, aplicação de ponte de união estrutural e selagem elástica de alta resiliência com mástique de poliuretano, terminando com reboco técnico hidrófugo.";
                whatsappText = "Olá Engenheiro! Utilizei o vosso MAPE AI Vision Inspector para analisar uma fissura na parede e obtive o diagnóstico de 'Fissura Estrutural por Assentamento'. Gostaria de agendar uma vistoria técnica presencial com a vossa equipa para avaliar o problema real.";
                break;

            case 'infiltracao':
                patologiaName = "Infiltração Crítica por Porosidade e Fissuração em Laje";
                gravidade = "Crítico";
                gravidadeClass = "badge-red";
                confianca = "98.2%";
                recomendacao = "Requer reabilitação urgente com remoção de materiais degradados. Aplicação de sistema de impermeabilização líquida elastomérica multicamadas de alta durabilidade com proteção térmica refletora reflexiva prateada MAPE.";
                whatsappText = "Olá Engenheiro! Utilizei o vosso MAPE AI Vision Inspector para analisar uma infiltração na laje e obtive o diagnóstico de 'Infiltração Crítica por Porosidade e Fissuração'. Gostaria de agendar uma visita técnica presencial para resolvermos este problema de raiz.";
                break;

            case 'aquecimento':
                patologiaName = "Irradiação Térmica Excessiva por Cobertura Metálica";
                gravidade = "Moderado";
                gravidadeClass = "badge-orange";
                confianca = "91.8%";
                recomendacao = "Ausência de barreira de radiação. Recomenda-se instalação sob telha de membrana aluminizada com dupla face refletiva de alto rendimento. Promove redução térmica ambiente de até 8°C.";
                whatsappText = "Olá Engenheiro! Utilizei o vosso MAPE AI Vision Inspector para analisar o aquecimento excessivo e obtive o diagnóstico de 'Irradiação Térmica Excessiva por Cobertura Metálica'. Gostaria de solicitar um orçamento para isolamento térmico.";
                break;

            case 'humidade':
                patologiaName = "Humidade Ascendente por Capilaridade de Fundações";
                gravidade = "Alto Risco";
                gravidadeClass = "badge-orange";
                confianca = "93.4%";
                recomendacao = "Infiltração vinda do solo devido a sapata não isolada. Recomenda-se a injeção química de barreiras hidrófugas ou picagem integral do reboco contaminado com posterior aplicação de reboco macroporoso desumidificante.";
                whatsappText = "Olá Engenheiro! Utilizei o vosso MAPE AI Vision Inspector para analisar a humidade capilar e obtive o diagnóstico de 'Humidade Ascendente por Capilaridade'. Gostaria de agendar uma vistoria técnica para avaliar a sapata e fundações.";
                break;

            case 'custom':
            default:
                patologiaName = "Anomalia Superficial de Revestimento ou Humidade Localizada";
                gravidade = "Análise Requerida";
                gravidadeClass = "badge-orange";
                confianca = "88.7%";
                recomendacao = "A imagem apresenta indícios de desgaste estrutural, manchas de água ou anomalia geométrica. Recomenda-se uma vistoria presencial detalhada por um profissional para mapear a patologia real.";
                whatsappText = "Olá Engenheiro! Carreguei uma fotografia no vosso MAPE AI Vision Inspector e obtive o diagnóstico preliminar de 'Anomalia Superficial'. Gostaria de enviar a fotografia e agendar uma verificação in loco com o vosso Engenheiro Principal.";
                break;
        }

        // Update DOM Elements
        reportPatologia.textContent = patologiaName;
        reportGravidade.textContent = gravidade;

        // Reset classes
        reportGravidade.className = "report-status";
        reportGravidade.classList.add(gravidadeClass);

        reportConfianca.textContent = confianca;
        reportRecomendacao.textContent = recomendacao;

        // Update WhatsApp CTA Link
        const officialWhatsAppNumber = "258841234567"; // Official phone mapping
        aiWhatsappBtn.href = `https://wa.me/${officialWhatsAppNumber}?text=${encodeURIComponent(whatsappText)}`;

        // Show report card
        aiReportCard.style.display = 'flex';

        // Smooth scroll to the report card
        aiReportCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
});
