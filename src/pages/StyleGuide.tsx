import SEO from "@/components/SEO";

const StyleGuide = () => {
  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      <SEO
        title="Haste Brand Style Guide"
        description="Brand style guide for Haste Conform Studio, including typography, colors, and logos."
        canonical="/style-guide"
      />
      
      <div className="container mx-auto px-6 md:px-12 py-8 md:py-12 max-w-[1400px]">
        {/* Main Logo */}
        <div className="mb-12 md:mb-16">
          <img 
            src="https://api.builder.io/api/v1/image/assets/TEMP/9836a0ec1d88cbf35fb7b9b0b8de8826b5f7eb61?width=1699" 
            alt="Haste Logo" 
            className="w-full max-w-[850px] h-auto"
          />
        </div>

        {/* Brand Style Guide Title */}
        <div className="mb-16 md:mb-20">
          <h1 className="text-4xl md:text-5xl lg:text-[66px] font-bold leading-tight mb-4" style={{ fontFamily: 'Helvetica Neue, -apple-system, Roboto, Helvetica, sans-serif' }}>
            BRAND STYLE GUIDE
          </h1>
          <p className="text-lg md:text-2xl lg:text-[26px] opacity-50 font-medium" style={{ fontFamily: 'Helvetica Neue, -apple-system, Roboto, Helvetica, sans-serif' }}>
            Version 1.0 • September 2025
          </p>
        </div>

        {/* Typography Section */}
        <div className="mb-16 md:mb-24">
          <p className="text-lg md:text-2xl lg:text-[26px] opacity-50 font-medium mb-6" style={{ fontFamily: 'Helvetica Neue, -apple-system, Roboto, Helvetica, sans-serif' }}>
            Typography
          </p>
          <h2 className="text-3xl md:text-5xl lg:text-[66px] font-bold leading-tight mb-2" style={{ fontFamily: 'Helvetica Neue, -apple-system, Roboto, Helvetica, sans-serif' }}>
            HELVETICA NEUE BOLD
          </h2>
          <div className="text-6xl md:text-8xl lg:text-[240px] font-bold leading-none tracking-[-0.05em] mb-8" style={{ fontFamily: 'Helvetica Neue, -apple-system, Roboto, Helvetica, sans-serif' }}>
            GO BIG
          </div>
          <div className="space-y-2 text-lg md:text-2xl lg:text-[26px] font-medium" style={{ fontFamily: 'Helvetica Neue, -apple-system, Roboto, Helvetica, sans-serif' }}>
            <p className="uppercase">AND GO BOLD. GO ALL CAPS WHENEVER POSSIBLE</p>
            <p className="uppercase">FAVOR HARD LEFT OR JUSTIFIED ALIGNMENT</p>
            <p 
              className="uppercase text-xl md:text-2xl lg:text-[28px] font-bold bg-clip-text text-transparent"
              style={{
                background: 'linear-gradient(86deg, rgb(58, 214, 97) 0%, rgb(68, 126, 208) 52.4%, rgb(166, 52, 211) 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              USE A GRADIENT FOR EMPHASIS
            </p>
          </div>
        </div>

        {/* Color Section */}
        <div className="mb-16 md:mb-20">
          <p className="text-lg md:text-2xl lg:text-[26px] opacity-50 font-medium mb-8" style={{ fontFamily: 'Helvetica Neue, -apple-system, Roboto, Helvetica, sans-serif' }}>
            Color
          </p>
          <div className="flex flex-wrap items-center gap-4 md:gap-6 lg:gap-8 mb-4">
            <div className="text-3xl md:text-4xl lg:text-[53px] font-bold" style={{ fontFamily: 'Helvetica Neue, -apple-system, Roboto, Helvetica, sans-serif', color: '#DB8969' }}>
              ORANGE
            </div>
            <div className="text-3xl md:text-4xl lg:text-[53px] font-bold" style={{ fontFamily: 'Helvetica Neue, -apple-system, Roboto, Helvetica, sans-serif', color: '#BC49B6' }}>
              PINK
            </div>
            <div className="text-3xl md:text-4xl lg:text-[53px] font-bold" style={{ fontFamily: 'Helvetica Neue, -apple-system, Roboto, Helvetica, sans-serif', color: '#569ECD' }}>
              BLUE
            </div>
            <div className="text-3xl md:text-4xl lg:text-[53px] font-bold" style={{ fontFamily: 'Helvetica Neue, -apple-system, Roboto, Helvetica, sans-serif', color: '#4DCE94' }}>
              GREEN
            </div>
            <div className="text-3xl md:text-4xl lg:text-[53px] font-bold" style={{ 
              fontFamily: 'Helvetica Neue, -apple-system, Roboto, Helvetica, sans-serif',
              WebkitTextStroke: '1px rgba(98, 98, 98, 1)',
              color: 'transparent'
            }}>
              BLACK
            </div>
            <div className="text-3xl md:text-4xl lg:text-[53px] font-bold" style={{ fontFamily: 'Helvetica Neue, -apple-system, Roboto, Helvetica, sans-serif' }}>
              WHITE
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-4 md:gap-6 lg:gap-8 text-xl md:text-2xl lg:text-[26px] font-medium opacity-50" style={{ fontFamily: 'Helvetica Neue, -apple-system, Roboto, Helvetica, sans-serif' }}>
            <span style={{ color: '#DB8969' }}>DB8969</span>
            <span style={{ color: '#BC49B6' }}>BC49B6</span>
            <span style={{ color: '#569ECD' }}>569ECD</span>
            <span style={{ color: '#4DCE94' }}>4DCE94</span>
            <span className="opacity-60">000000</span>
            <span>FFFFFF</span>
          </div>
        </div>

        {/* Conform Logos Section */}
        <div className="mb-12">
          <p className="text-lg md:text-2xl lg:text-[26px] opacity-50 font-medium mb-8" style={{ fontFamily: 'Helvetica Neue, -apple-system, Roboto, Helvetica, sans-serif' }}>
            Conform Logos
          </p>
          
          {/* Logo variations */}
          <div className="space-y-8">
            {/* Small logo with text */}
            <div className="bg-white p-6 md:p-8 inline-block">
              <img 
                src="https://api.builder.io/api/v1/image/assets/TEMP/3f17e53dfdcae870c488df30c99bd2be8391b1f2?width=640" 
                alt="Conform Studio Logo Small" 
                className="h-4 w-auto"
              />
            </div>

            {/* Medium logo */}
            <div>
              <img 
                src="https://api.builder.io/api/v1/image/assets/TEMP/a047641bb67fc7b11e3e1c43182bf153a25930e0?width=640" 
                alt="Conform Studio Logo Medium" 
                className="h-4 w-auto"
              />
            </div>

            {/* Large logo variations */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-12">
              <div>
                <img 
                  src="https://api.builder.io/api/v1/image/assets/TEMP/ad5338c898d5645d52266a3899a9c5c069d0cf0c?width=914" 
                  alt="Conform Logo Large" 
                  className="w-full max-w-[457px] h-auto"
                />
              </div>
              <div>
                <img 
                  src="https://api.builder.io/api/v1/image/assets/TEMP/c416591c02d66ea959e412a642b84e15355da7cb?width=823" 
                  alt="Studio Logo" 
                  className="w-full max-w-[411px] h-auto opacity-50"
                />
              </div>
            </div>

            {/* Additional logo variation */}
            <div className="mt-8">
              <img 
                src="https://api.builder.io/api/v1/image/assets/TEMP/dfa2fb3e69cc8cbca79868bcfeba29c81fa7993d?width=484" 
                alt="Logo Detail" 
                className="w-full max-w-[242px] h-auto opacity-50"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StyleGuide;
