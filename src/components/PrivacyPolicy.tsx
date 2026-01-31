import React from 'react';

interface PrivacyPolicyProps {
    onClose: () => void;
}

export const PrivacyPolicy: React.FC<PrivacyPolicyProps> = ({ onClose }) => {
    return (
        <div className="fixed inset-0 z-[100] flex items-start md:items-center justify-center p-4 bg-black/90 backdrop-blur-md overflow-y-auto outline-none" role="dialog" aria-modal="true">
            <div className="bg-gray-800 text-white rounded-2xl max-w-2xl w-full p-6 md:p-8 shadow-2xl relative border border-white/10 my-auto">

                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-white/60 hover:text-white transition-colors p-2"
                    aria-label="Cerrar política de privacidad"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                <h2 className="text-2xl font-bold mb-6 text-amber-400">Política de Privacidad</h2>

                <div className="space-y-4 text-sm md:text-base leading-relaxed text-gray-300">
                    <p>
                        <strong>Impacto Digital Radio</strong> valora su privacidad. Esta política describe cómo manejamos la información en nuestra aplicación web.
                    </p>

                    <section>
                        <h3 className="text-lg font-semibold text-white mb-2">1. Información que Recopilamos</h3>
                        <p>
                            Nuestra aplicación es puramente informativa y para transmisión de audio. <strong>No solicitamos, recopilamos ni almacenamos datos personales</strong> de los usuarios, como nombres, correos electrónicos o números telefónicos, a menos que usted decida contactarnos voluntariamente a través de WhatsApp.
                        </p>
                    </section>

                    <section>
                        <h3 className="text-lg font-semibold text-white mb-2">2. Uso de Cookies y Almacenamiento Local</h3>
                        <p>
                            Podemos utilizar el almacenamiento local de su navegador para guardar preferencias simples, como el nivel de volumen, para mejorar su experiencia de usuario. Estas no contienen información de identificación personal.
                        </p>
                    </section>

                    <section>
                        <h3 className="text-lg font-semibold text-white mb-2">3. Servicios de Terceros</h3>
                        <p>
                            Utilizamos servicios de transmisión de audio externos (Voztream y Zeno.fm). Estos servicios pueden recopilar datos técnicos anónimos (como dirección IP) necesarios para la entrega del flujo de audio. Para más información, consulte las políticas de privacidad de dichos proveedores.
                        </p>
                    </section>

                    <section>
                        <h3 className="text-lg font-semibold text-white mb-2">4. Redes Sociales</h3>
                        <p>
                            Nuestra aplicación incluye enlaces a Facebook, Instagram y YouTube. Al hacer clic en estos enlaces, usted interactuará directamente con dichas plataformas bajo sus propias políticas de privacidad.
                        </p>
                    </section>

                    <section>
                        <h3 className="text-lg font-semibold text-white mb-2">5. Contacto</h3>
                        <p>
                            Si tiene preguntas sobre esta política, puede contactarnos a través de nuestras redes sociales oficiales o vía WhatsApp.
                        </p>
                    </section>

                    <p className="pt-4 text-xs text-gray-500 italic">
                        Última actualización: Enero 2026
                    </p>
                </div>

                <div className="mt-8 flex justify-center">
                    <button
                        onClick={onClose}
                        className="bg-amber-500 hover:bg-amber-600 text-black font-bold py-2 px-8 rounded-full transition-colors shadow-lg"
                    >
                        Entendido
                    </button>
                </div>
            </div>
        </div>
    );
};
